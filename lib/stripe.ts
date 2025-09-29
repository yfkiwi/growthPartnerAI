import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export const PRICE_IDS = {
  single: 2900, // $29.00
  bundle: 9900, // $99.00
} as const;
