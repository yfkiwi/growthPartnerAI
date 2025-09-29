import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { CreateSubmissionRequest } from '@/types';

async function generateAccessToken(): Promise<string> {
  // 32-byte random token in hex
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // Fallback to UUID if web crypto available in edge runtime
    return crypto.randomUUID().replace(/-/g, '');
  }
  const nodeCrypto = await import('crypto');
  return nodeCrypto.randomBytes(24).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, idea, reportType }: CreateSubmissionRequest = body;
    const bundleId: string | undefined = body.bundle_id || body.bundleId;
    
    // Validate required fields
    if (!email || !idea || !reportType) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      );
    }

    // Validate report type
    const validReportTypes = ['validation', 'competitor', 'mvp', 'investor', 'gtm'];
    if (!validReportTypes.includes(reportType)) {
      return NextResponse.json(
        { error: 'Invalid report type' }, 
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    const accessToken = await generateAccessToken();
    
    let payment_status: 'free' | 'paid_single' | 'paid_bundle' = 'free';
    let bundle_id: string | undefined = undefined;

    if (bundleId) {
      // Validate bundle
      const { data: bundle, error: bErr } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single();
      if (bErr || !bundle) {
        return NextResponse.json({ error: 'Invalid bundle_id' }, { status: 400 });
      }
      if (bundle.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Bundle is not paid yet' }, { status: 403 });
      }
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, report_type')
        .eq('bundle_id', bundleId);
      const used = subs?.length || 0;
      if (used >= 5) {
        return NextResponse.json({ error: 'Bundle report limit reached' }, { status: 403 });
      }
      // Prevent duplicate report type within the bundle
      if (subs && subs.some((s: { report_type: string }) => s.report_type === reportType)) {
        return NextResponse.json({ error: 'This report type was already generated for this bundle' }, { status: 409 });
      }
      payment_status = 'paid_bundle';
      bundle_id = bundleId;
    }

    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          email,
          idea,
          report_type: reportType,
          status: 'pending',
          payment_status,
          access_token: accessToken,
          bundle_id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create submission' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: bundleId ? 'Report will be ready in 24h' : undefined,
      submission: data,
      access_token: accessToken
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ submissions: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
