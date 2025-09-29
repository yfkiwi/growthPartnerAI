import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> } 
) {
  try {
    const { token } = await params; 
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('access_token', token)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}