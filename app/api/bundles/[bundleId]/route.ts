import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bundleId: string }> }
) {
  try {
    const { bundleId } = await params;
    const supabase = createClient();

    const { data: bundle, error: bundleError } = await supabase
      .from('bundles')
      .select('*')
      .eq('id', bundleId)
      .single();

    if (bundleError || !bundle) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
    }

    const { data: submissions, error: subsError } = await supabase
      .from('submissions')
      .select('*')
      .eq('bundle_id', bundleId)
      .order('created_at', { ascending: false });

    if (subsError) {
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    const used = submissions?.length || 0;
    const limit = 5;

    return NextResponse.json({ bundle, submissions, used, limit });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


