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

    const businessProfile = await prisma.businessProfile.findUnique({ where: { workspaceId } });
    const brandKit = await prisma.brandKit.findUnique({ where: { workspaceId } });

    return NextResponse.json({ strategy: { businessProfile, brandKit } }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch strategy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
