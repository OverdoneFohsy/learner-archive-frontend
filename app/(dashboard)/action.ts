'use server'

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

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

