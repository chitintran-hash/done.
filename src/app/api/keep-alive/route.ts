import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ status: 'error', message: 'Missing env vars' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Ping the database to keep it active
    const { data, error } = await supabase.from('products').select('id').limit(1);

    if (error) {
      console.error("Keep-alive ping failed:", error);
      return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', message: 'Supabase pinged successfully', data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
