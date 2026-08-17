import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const activeWorkspace = await getActiveWorkspace();
    if (!activeWorkspace) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    const workspaceId = activeWorkspace.id;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        memberships: {
          include: { user: true }
        }
      }
    });

    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch workspace settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const activeWorkspace = await getActiveWorkspace();
    if (!activeWorkspace) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    const workspaceId = activeWorkspace.id;

    const { name } = await req.json();

    if (!name) return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: { name }
    });

    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error) {
    console.error('Failed to update workspace settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
