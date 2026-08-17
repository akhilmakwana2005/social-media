import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    const workspaceId = workspace.id;
    if (!workspaceId) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });

    const { planId } = await req.json();

    // Map plans to mock Stripe price IDs or real ones if env holds them
    const priceMap: Record<string, string> = {
      'GROWTH': process.env.STRIPE_PRICE_GROWTH || 'price_mock_growth',
      'AGENCY': process.env.STRIPE_PRICE_AGENCY || 'price_mock_agency',
    };

    const priceId = priceMap[planId];
    if (!priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    // Mock response if no real key
    if (!process.env.STRIPE_SECRET_KEY) {
      // Simulate successful upgrade immediately for demonstration purposes
      await prisma.subscription.upsert({
        where: { workspaceId },
        update: { plan: planId, status: 'ACTIVE' },
        create: {
          workspaceId,
          plan: planId,
          status: 'ACTIVE',
          providerCustomerId: `mock-cus-${workspaceId.slice(0, 8)}`
        }
      });
      return NextResponse.json({ url: `/dashboard/billing?success=true&plan=${planId}` });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard/billing?success=true`,
      cancel_url: `${req.headers.get('origin')}/dashboard/billing?canceled=true`,
      client_reference_id: workspaceId,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
