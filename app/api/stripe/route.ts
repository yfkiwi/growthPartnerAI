import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { StripePaymentRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { submissionId, priceType }: StripePaymentRequest = await request.json();
    
    if (!submissionId || !priceType) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    if (!['single', 'bundle'].includes(priceType)) {
      return NextResponse.json(
        { error: 'Invalid price type' }, 
        { status: 400 }
      );
    }
    
    const amount = priceType === 'bundle' ? 9900 : 2900; // $99 or $29 in cents
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        submissionId,
        priceType
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' }, 
      { status: 500 }
    );
  }
}
