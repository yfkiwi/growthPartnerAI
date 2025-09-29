import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Using Resend API via fetch to avoid adding SDK dependency
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { submission_id } = await request.json();

    if (!submission_id) {
      return NextResponse.json({ error: 'submission_id is required' }, { status: 400 });
    }
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 500 });
    }

    const supabase = createClient();
    const { data: submission, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submission_id)
      .single();

    if (error || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (!submission.access_token) {
      return NextResponse.json({ error: 'Submission has no access token' }, { status: 400 });
    }

    const reportUrl = `${APP_URL}/report/by-token/${submission.access_token}`;
    const subject = `Your ${submission.report_type} report is ready${submission.bundle_id ? ' (Bundle)' : ''}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>🚀 Your ${submission.report_type} report</h2>
        <p>Thank you for submitting your idea. Your free summary is ready now.</p>
        <p>
          You can view your report using the secure link below:
        </p>
        <p>
          <a href="${reportUrl}" style="background:#2563eb;color:#fff;padding:12px 16px;border-radius:8px;text-decoration:none;display:inline-block">View Your Report</a>
        </p>
        ${submission.bundle_id ? `<p style="margin-top:16px;">This is part of your Founder Bundle. Progress updates will appear on your dashboard.</p>` : `<p style=\"margin-top:16px;\">Inside you'll find a free summary. You can unlock the full report any time.</p>`}
      </div>
    `;

    const sendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [submission.email],
        subject,
        html
      })
    });

    if (!sendResponse.ok) {
      const text = await sendResponse.text();
      console.error('Resend error:', text);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
    }

    // Update email_sent_at timestamp in database
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('id', submission_id);

    if (updateError) {
      console.error('Failed to update email_sent_at:', updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true, reportUrl });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


