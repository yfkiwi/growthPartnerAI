import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed.', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = (session.metadata || {}) as Record<string, string>;
      const submissionId = metadata.submission_id;
      const priceType = metadata.price_type as 'single' | 'bundle';
      const bundleId = metadata.bundle_id || undefined;
      const paymentIntentId = String(session.payment_intent || '');

      if (priceType === 'single') {
        await supabase
          .from('submissions')
          .update({ payment_status: 'paid_single', stripe_payment_intent_id: paymentIntentId })
          .eq('id', submissionId);
      } else if (priceType === 'bundle' && bundleId) {
        await supabase
          .from('bundles')
          .update({ payment_status: 'paid', stripe_payment_intent: paymentIntentId })
          .eq('id', bundleId);

        await supabase
          .from('submissions')
          .update({ payment_status: 'paid_bundle' })
          .eq('id', submissionId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handling error:', err);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

 