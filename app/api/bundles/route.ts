import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { user_email } = await request.json();
    if (!user_email) {
      return NextResponse.json({ error: 'user_email is required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('bundles')
      .insert([{ user_email, payment_status: 'pending' }])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create bundle' }, { status: 500 });
    }

    return NextResponse.json({ bundle_id: data.id, bundle: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


