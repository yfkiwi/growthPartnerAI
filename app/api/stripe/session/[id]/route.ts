import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}


