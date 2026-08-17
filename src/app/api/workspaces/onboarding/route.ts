import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getActiveWorkspace();
    if (!workspace) {
      return NextResponse.json({ error: 'No active workspace found' }, { status: 404 });
    }

    const { industry, location, services, audience, goals } = await req.json();

    if (!industry || !location || !services || !audience || !goals) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const businessProfile = await prisma.businessProfile.upsert({
      where: { workspaceId: workspace.id },
      update: {
        industry,
        location,
        services,
        audience,
        goals
      },
      create: {
        workspaceId: workspace.id,
        industry,
        location,
        services,
        audience,
        goals
      }
    });

    return NextResponse.json({ success: true, businessProfile }, { status: 200 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
