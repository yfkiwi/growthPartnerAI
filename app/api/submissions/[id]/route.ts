import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' }, 
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Submission not found' }, 
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Submission not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      submission: data 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
