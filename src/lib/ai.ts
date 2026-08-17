import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface SocialPostParams {
  topic: string;
  platform: string;
  goal?: string;
  tone?: string;
  businessProfile: {
    industry: string;
    services: string;
    audience: string;
  };
  brandKit: {
    restrictions?: string;
    cta?: string;
  };
}

export async function generateSocialPost(params: SocialPostParams) {
  const { topic, platform, goal, tone, businessProfile, brandKit } = params;

  const systemPrompt = `
You are an expert Social Media Manager. Write a highly engaging post for ${platform}.
Business Context:
- Industry: ${businessProfile.industry}
- Services/Products: ${businessProfile.services}
- Target Audience: ${businessProfile.audience}

Brand Guidelines:
- Tone of Voice: ${tone || 'Professional yet engaging'}
- Default Call-to-Action: ${brandKit.cta || 'Link in bio'}
- Restrictions/Prohibited: ${brandKit.restrictions || 'None'}

Rules:
- Adapt the length and style perfectly for ${platform}.
- Include a strong hook.
- Ensure the requested tone is strictly followed.
- Do NOT include any restricted phrases.
- Add relevant hashtags.
`;

  const userPrompt = `
Topic: ${topic}
Goal of this post: ${goal || 'Engagement'}

Please generate the post content now.
`;

  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.7,
  });

  return text;
}
