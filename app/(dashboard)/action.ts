'use server'

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { revalidatePath } from 'next/cache';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function getSessionsAction() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: 'Unauthorized' };

    try {
      const response = await fetch(`${FASTAPI_URL}/sessions/`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      return [];
    }
  }

export async function deleteSessionAction(sessionId: string){
    const supabase = await createClient();
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) return {error: "Unauthorized"};

    try{
        const response = await fetch(`${FASTAPI_URL}/sessions/${sessionId}`, {
            method: 'DELETE',
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        });

        if (!response.ok) return {error: `Faiiled to delete session`}

        revalidatePath('/');
        return {success: true};
    }
    catch(error){
        console.error("Failed to fetch sessions:", error);
        return {error: `Faiiled to delete session ${error}`}
    }

}

export async function getSources() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: 'Unauthorized' };

    try {
      const response = await fetch(`${FASTAPI_URL}/ingestion/`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      return [];
    }
  }

  export async function deleteSourceAction(sourceId: string){
    const supabase = await createClient();
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) return {error: "Unauthorized"};

    try{
        const response = await fetch(`${FASTAPI_URL}/ingestion/user/source?source_id=${sourceId}`, {
            method: 'DELETE',
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        });

        if (!response.ok) return {error: `Faiiled to delete source`}

        revalidatePath('/dashboard');
        return {success: true};
    }
    catch(error){
        console.error("Failed to fetch sessions:", error);
        return {error: `Faiiled to delete session ${error}`}
    }

}

