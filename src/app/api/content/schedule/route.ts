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

    const schedules = await prisma.schedule.findMany({
      where: {
        variant: {
          content: {
            workspaceId
          }
        }
      },
      include: {
        variant: {
          include: {
            content: true
          }
        },
        publication: true
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
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

    const { variantId, scheduledAt, timezone } = await req.json();

    if (!variantId || !scheduledAt || !timezone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify variant belongs to workspace
    const variant = await prisma.contentVariant.findUnique({
      where: { id: variantId },
      include: { content: true }
    });

    if (!variant || variant.content.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Variant not found or unauthorized' }, { status: 404 });
    }

    const schedule = await prisma.schedule.create({
      data: {
        variantId,
        scheduledAt: new Date(scheduledAt),
        timezone,
        status: 'PENDING'
      }
    });

    // Also update content status
    await prisma.content.update({
      where: { id: variant.contentId },
      data: { status: 'SCHEDULED' }
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    console.error('Failed to schedule content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
