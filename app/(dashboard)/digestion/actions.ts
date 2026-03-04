'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function digestVideoAction(prevState: any, formData: FormData) {
  const videoId = formData.get('videoId') as string;
  const supabase = await createClient();
  
  // 1. Get the session for the Auth token
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const response = await fetch(`${FASTAPI_URL}/ingestion/video?video_id=${videoId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Failed to process video');

    console.log(`Error: ${result.detail}`);
    revalidatePath('/digestion');
    return { success: true, message: 'Video is being processed!' };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function digestPdfAction(prevState: any, formData: FormData) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: 'Please select a PDF file' };

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Unauthorized' };

  // For file uploads, we use FormData to send to FastAPI
  const apiFormData = new FormData();
  apiFormData.append('file', file);

  try {
    const response = await fetch(`${FASTAPI_URL}/ingestion/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: apiFormData, // Next.js forwards the multipart/form-data
    });

    const result = await response.json();
    console.log(result);
    if (!response.ok) throw new Error(result.detail || 'Failed to process PDF');

    revalidatePath('/digestion');
    return { success: true, message: 'PDF uploaded and processing!' };
  } catch (err: any) {
    console.log("Error caught");
    return { error: err.message };
  }
}