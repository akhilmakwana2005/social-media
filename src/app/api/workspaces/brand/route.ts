import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace found' }, { status: 404 });

    const brandKit = await prisma.brandKit.findUnique({
      where: { workspaceId: workspace.id }
    });

    return NextResponse.json({ brandKit: brandKit || {} }, { status: 200 });
  } catch (error) {
    console.error('Fetch brand kit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace found' }, { status: 404 });

    const { logoUrl, colors, tone, cta, restrictions } = await req.json();

    const brandKit = await prisma.brandKit.upsert({
      where: { workspaceId: workspace.id },
      update: {
        logoUrl: logoUrl || null,
        colors: colors || "",
        tone: tone || "",
        cta: cta || null,
        restrictions: restrictions || null
      },
      create: {
        workspaceId: workspace.id,
        logoUrl: logoUrl || null,
        colors: colors || "",
        tone: tone || "",
        cta: cta || null,
        restrictions: restrictions || null
      }
    });

    return NextResponse.json({ success: true, brandKit }, { status: 200 });
  } catch (error) {
    console.error('Update brand kit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
