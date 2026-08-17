import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace found' }, { status: 404 });

    const { platform, text, pillar, goal, mediaId } = await req.json();

    if (!platform || !text) {
      return NextResponse.json({ error: 'Missing platform or text' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create content record
      const content = await tx.content.create({
        data: {
          workspaceId: workspace.id,
          type: 'POST',
          status: 'PUBLISHED',
          goal: goal || 'Brand Awareness',
          pillar: pillar || 'General',
        }
      });

      // 2. Create content variant
      const variant = await tx.contentVariant.create({
        data: {
          contentId: content.id,
          platform,
          text,
          mediaId: mediaId || null
        }
      });

      // 3. Create schedule record (status: SUCCESS)
      const schedule = await tx.schedule.create({
        data: {
          variantId: variant.id,
          scheduledAt: new Date(),
          timezone: 'GMT',
          status: 'SUCCESS'
        }
      });

      // 4. Create publication record
      const publication = await tx.publication.create({
        data: {
          scheduleId: schedule.id,
          externalPostId: `${platform.toLowerCase()}-post-${Date.now()}`,
          publishedAt: new Date()
        }
      });

      // 5. Generate realistic engagement metrics
      const impressions = Math.floor(Math.random() * 3000) + 1500; // 1500 - 4500
      const reach = Math.floor(impressions * 0.75);
      const likes = Math.floor(reach * 0.08) + 10;
      const comments = Math.floor(likes * 0.15) + 2;
      const clicks = Math.floor(reach * 0.03) + 5;
      const shares = Math.floor(likes * 0.05);

      await tx.analyticsSnapshot.create({
        data: {
          publicationId: publication.id,
          impressions,
          reach,
          likes,
          comments,
          shares,
          clicks
        }
      });

      // 6. Create Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'PUBLISH',
          objectType: 'CONTENT',
          objectId: content.id,
          metadata: JSON.stringify({
            name: `Successfully published ${platform.toLowerCase()} post: "${text.substring(0, 30)}..."`,
            platform,
            likes,
            impressions
          })
        }
      });

      return { content, publication };
    });

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error('Publish content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
