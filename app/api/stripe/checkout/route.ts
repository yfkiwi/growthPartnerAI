import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { submission_id, price_type } = await request.json();
    if (!submission_id || !price_type || !['single', 'bundle'].includes(price_type)) {
      return NextResponse.json({ error: 'submission_id and valid price_type are required' }, { status: 400 });
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const priceSingle = process.env.NEXT_PUBLIC_STRIPE_PRICE_SINGLE!;
    const priceBundle = process.env.NEXT_PUBLIC_STRIPE_PRICE_BUNDLE!;

    let bundleId: string | undefined;
    if (price_type === 'bundle') {
      // Create bundle record with pending status and link to submission
      const { data: bundle, error: bundleErr } = await supabase
        .from('bundles')
        .insert([{ user_email: submission.email, payment_status: 'pending' }])
        .select('*')
        .single();

      if (bundleErr || !bundle) {
        return NextResponse.json({ error: 'Failed to create bundle' }, { status: 500 });
      }
      bundleId = bundle.id;
      await supabase
        .from('submissions')
        .update({ bundle_id: bundleId })
        .eq('id', submission.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: submission.email,
      line_items: [
        {
          price: price_type === 'bundle' ? priceBundle : priceSingle,
          quantity: 1,
        },
      ],
      metadata: {
        submission_id,
        price_type,
        bundle_id: bundleId || '',
      },
      success_url: `${appUrl}/report/by-token/${submission.access_token}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/report/by-token/${submission.access_token}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

 