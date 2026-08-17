import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace found' }, { status: 404 });

    const { type, status, goal, pillar, platform, text } = await req.json();

    if (!platform || !text) {
      return NextResponse.json({ error: 'Missing platform or text' }, { status: 400 });
    }

    const content = await prisma.$transaction(async (tx) => {
      const newContent = await tx.content.create({
        data: {
          workspaceId: workspace.id,
          type: type || 'POST',
          status: status || 'DRAFT',
          goal,
          pillar,
        }
      });

      await tx.contentVariant.create({
        data: {
          contentId: newContent.id,
          platform,
          text
        }
      });

      return newContent;
    });

    return NextResponse.json({ success: true, content }, { status: 201 });
  } catch (error) {
    console.error('Save content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
