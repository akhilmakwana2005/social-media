import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const provider = url.searchParams.get('provider')?.toUpperCase();

  if (!provider) {
    return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
  }

  const callbackUrl = encodeURIComponent(`${req.nextUrl.origin}/api/workspaces/socials/callback?provider=${provider}`);

  if (provider === 'LINKEDIN') {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    if (!clientId) {
      // Development Fallback: Automatically connect simulated account if keys are not configured
      return NextResponse.redirect(`${req.nextUrl.origin}/api/workspaces/socials/callback?provider=${provider}&code=mock-code-123`);
    }
    
    const linkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=w_member_social%20r_liteprofile`;
    return NextResponse.redirect(linkedInUrl);
  }

  if (provider === 'FACEBOOK' || provider === 'INSTAGRAM') {
    const clientId = process.env.FACEBOOK_CLIENT_ID;
    if (!clientId) {
      // Development Fallback: Automatically connect simulated account if keys are not configured
      return NextResponse.redirect(`${req.nextUrl.origin}/api/workspaces/socials/callback?provider=${provider}&code=mock-code-123`);
    }
    
    const facebookUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`;
    return NextResponse.redirect(facebookUrl);
  }

  if (provider === 'TWITTER') {
    const clientId = process.env.TWITTER_CLIENT_ID;
    if (!clientId) {
      // Development Fallback: Automatically connect simulated account if keys are not configured
      return NextResponse.redirect(`${req.nextUrl.origin}/api/workspaces/socials/callback?provider=${provider}&code=mock-code-123`);
    }
    
    const twitterUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=tweet.read%20tweet.write%20users.read&state=antigravity&code_challenge=challenge&code_challenge_method=plain`;
    return NextResponse.redirect(twitterUrl);
  }

  return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/socials?error=unsupported_provider`);
}
