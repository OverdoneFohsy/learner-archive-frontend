'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Server side log
 */
export async function logToTerminal(message: any, label: string = "DEBUG") {
    console.log(`[${label}]`, message);
  }

/**
 * Redirects the user to the chat page
 */
export async function createChatAction(firstMsg: string) {
    // 1. Generate the UUID locally
    const newSessionId = crypto.randomUUID();
    
    revalidatePath('/', 'layout');
    // 2. Redirect immediately to the chat page
    redirect(`/conversation/${newSessionId}?firstMsg=${encodeURIComponent(firstMsg)}`);
  }

/**
 * Sends a message to the RAG pipeline and returns the AI response
 */
export async function sendMessageAction(sessionId: string, message: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const response = await fetch(`${FASTAPI_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ 
        session_id: sessionId, 
        message: message
      }),
    });

    console.log(`sessionId:${sessionId}`)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get AI response');
    }

    const data = await response.json();
    // Revalidate the chat history so the UI stays in sync
    revalidatePath(`/conversation/${sessionId}`);
    
    return { 
      role: 'assistant', 
      content: data.response,
      sources: data.sources
    };

  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getChatHistoryAction(sessionId: string){
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: 'Unauthorized' };

    try{
        const response = await fetch(`${FASTAPI_URL}/sessions/history?session_id=${sessionId}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
            'Authorization': `Bearer ${session.access_token}`,
             },},)
        
        if (!response.ok) return null;
        return await response.json();
    } catch(error){
        console.error("Failed to fetch messages", error);
        return null;
    }
}