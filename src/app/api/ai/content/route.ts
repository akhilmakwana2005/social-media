import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';
import { generateSocialPost } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace found' }, { status: 404 });

    const { topic, platform, goal, tone } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: 'Missing topic or platform' }, { status: 400 });
    }

    // Fetch context
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { workspaceId: workspace.id }
    });

    const brandKit = await prisma.brandKit.findUnique({
      where: { workspaceId: workspace.id }
    });

    if (!businessProfile) {
      return NextResponse.json({ error: 'Business profile not found. Complete onboarding first.' }, { status: 400 });
    }

    const prompt = `
      You are an expert social media manager.
      Generate a ${platform} post about: "${topic}".
      Goal: ${goal || 'Engage audience'}
      Tone: ${tone || brandKit?.tone || 'Professional'}
      Industry: ${businessProfile.industry}
      Target Audience: ${businessProfile.audience}
      Services: ${businessProfile.services}
      Restrictions/Prohibited Topics: ${brandKit?.restrictions || 'None'}
      Call to Action: ${brandKit?.cta || 'None'}

      Please provide just the post content, including appropriate emojis and hashtags. Do not include extra conversational text like "Here is your post:".
    `;

    const { generateGeminiText } = await import('@/lib/gemini');
    const generatedText = await generateGeminiText(prompt);

    return NextResponse.json({ success: true, text: generatedText }, { status: 200 });
  } catch (error: any) {
    console.error('AI content generation error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
