import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    const workspaceId = workspace.id;
    if (!workspaceId) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });

    const subscription = await prisma.subscription.findUnique({
      where: { workspaceId }
    });

    return NextResponse.json({ subscription: subscription || { plan: 'FREE', status: 'ACTIVE' } }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch billing info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    const workspaceId = workspace.id;
    if (!workspaceId) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });

    const { plan } = await req.json();

    if (!plan) return NextResponse.json({ error: 'Plan is required' }, { status: 400 });

    const subscription = await prisma.subscription.upsert({
      where: { workspaceId },
      update: { plan, status: 'ACTIVE' },
      create: {
        workspaceId,
        plan,
        status: 'ACTIVE',
        providerCustomerId: `mock-cus-${workspaceId.slice(0, 8)}`
      }
    });

    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error('Failed to update billing info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
