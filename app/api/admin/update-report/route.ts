import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { submission_id, summary_key_insight, summary_market_snapshot, summary_next_step, full_report_url, status } = await request.json();

    if (!submission_id) {
      return NextResponse.json({ error: 'submission_id is required' }, { status: 400 });
    }

    const summaries = [summary_key_insight, summary_market_snapshot, summary_next_step];
    if (summaries.every((s) => !s || String(s).trim().length === 0)) {
      return NextResponse.json({ error: 'At least one summary field is required' }, { status: 400 });
    }

    if (full_report_url && !isValidUrl(full_report_url)) {
      return NextResponse.json({ error: 'full_report_url must be a valid URL' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'processing', 'available', 'completed'];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const supabase = createClient();
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    if (typeof summary_key_insight === 'string') updates.summary_key_insight = summary_key_insight;
    if (typeof summary_market_snapshot === 'string') updates.summary_market_snapshot = summary_market_snapshot;
    if (typeof summary_next_step === 'string') updates.summary_next_step = summary_next_step;
    if (typeof full_report_url === 'string') updates.full_report_url = full_report_url;
    if (typeof status === 'string') updates.status = status;

    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', submission_id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true, submission: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


