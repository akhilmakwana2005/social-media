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

    // Fetch publications and their analytics from DB
    const publications = await prisma.publication.findMany({
      where: {
        schedule: {
          variant: {
            content: { workspaceId }
          }
        }
      },
      include: {
        analytics: true,
        schedule: {
          include: {
            variant: true
          }
        }
      }
    });

    // Aggregate metrics
    const aggregated = publications.reduce((acc, pub) => {
      if (pub.analytics) {
        acc.impressions += pub.analytics.impressions;
        acc.reach += pub.analytics.reach;
        acc.likes += pub.analytics.likes;
        acc.comments += pub.analytics.comments;
        acc.shares += pub.analytics.shares;
        acc.clicks += pub.analytics.clicks;
      }
      return acc;
    }, { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0 });

    // Format top posts list for client consumption
    const topPosts = publications.map(pub => ({
      id: pub.id,
      platform: pub.schedule.variant.platform,
      text: pub.schedule.variant.text,
      publishedAt: pub.publishedAt.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      impressions: pub.analytics?.impressions || 0,
      likes: pub.analytics?.likes || 0,
      comments: pub.analytics?.comments || 0,
      shares: pub.analytics?.shares || 0,
      clicks: pub.analytics?.clicks || 0
    })).sort((a, b) => b.impressions - a.impressions);

    // Calculate 7-day daily trend curve values
    const trendHistory = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      // Sum impressions published on this specific calendar date
      const dayImpressions = publications
        .filter(pub => new Date(pub.publishedAt).toDateString() === date.toDateString())
        .reduce((sum, pub) => sum + (pub.analytics?.impressions || 0), 0);

      return {
        date: dateStr,
        value: dayImpressions
      };
    });

    return NextResponse.json({ 
      success: true,
      metrics: aggregated,
      topPosts,
      history: trendHistory
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
