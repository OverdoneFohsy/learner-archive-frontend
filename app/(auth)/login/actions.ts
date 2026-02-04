'use server'

import {createClient} from "@/utils/supabase/server"
import {redirect} from 'next/navigation'
import { headers } from 'next/headers'

export async function login(prevState: any, formData: FormData){
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const {error} = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) return {error: error.message};

    return redirect ('/digestion');
    
}

export async function signup(prevState: any, formData: FormData){
    const supabase = await createClient();

    const headerStore = await headers();
    const origin = headerStore.get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const {error} = await supabase.auth.signUp({
        email,
        password,
        options:{
            emailRedirectTo: `${origin}/auth/callback`
        },
    });

    if (error) return {error: error.message}

    return redirect('/login?message=Check your email to confirm your account');
}
