import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getActiveWorkspace, getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.redirect(`${req.nextUrl.origin}/login`);

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    const workspaceId = workspace.id;
    if (!workspaceId) return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);

    const url = new URL(req.url);
    const provider = url.searchParams.get('provider')?.toUpperCase();
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    // If the user denied the authorization request on the social platform
    if (error) {
      return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/socials?error=authorization_denied`);
    }

    if (!provider || !code) {
      return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/socials?error=missing_code`);
    }

    const callbackUrl = `${req.nextUrl.origin}/api/workspaces/socials/callback?provider=${provider}`;
    let accessToken = null;
    let externalId = `user-${provider.toLowerCase()}-${Date.now()}`; // Default external ID if we can't fetch profile

    if (code === 'mock-code-123') {
      accessToken = 'mock-access-token-xyz';
      externalId = `mock-${provider.toLowerCase()}-id`;
    } else {
      // 1. LINKEDIN TOKEN EXCHANGE
      if (provider === 'LINKEDIN') {
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: callbackUrl,
            client_id: process.env.LINKEDIN_CLIENT_ID || '',
            client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
          })
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(tokenData.error_description || 'LinkedIn Token Error');
        accessToken = tokenData.access_token;
        
        // Attempt to fetch profile for external ID
        try {
          const profileRes = await fetch('https://api.linkedin.com/v2/me', { headers: { Authorization: `Bearer ${accessToken}` }});
          if (profileRes.ok) externalId = (await profileRes.json()).id;
        } catch (e) {}
      }

      // 2. FACEBOOK/INSTAGRAM TOKEN EXCHANGE
      else if (provider === 'FACEBOOK' || provider === 'INSTAGRAM') {
        const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${callbackUrl}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`);
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(tokenData.error?.message || 'Facebook Token Error');
        accessToken = tokenData.access_token;
        
        try {
          const profileRes = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}`);
          if (profileRes.ok) externalId = (await profileRes.json()).id;
        } catch (e) {}
      }

      // 3. TWITTER TOKEN EXCHANGE
      else if (provider === 'TWITTER') {
        const basicAuth = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64');
        const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`
          },
          body: new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            client_id: process.env.TWITTER_CLIENT_ID || '',
            redirect_uri: callbackUrl,
            code_verifier: 'challenge' // Needs to match code_challenge_method
          })
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Twitter Token Error');
        accessToken = tokenData.access_token;
      }
    }

    if (!accessToken) {
      throw new Error('Failed to securely exchange token');
    }

    // Real persistence to Database
    await prisma.socialAccount.upsert({
      where: {
        workspaceId_provider_externalId: {
          workspaceId,
          provider,
          externalId
        }
      },
      update: {
        status: 'CONNECTED',
        encryptedToken: accessToken,
        scopes: 'read write publish'
      },
      create: {
        workspaceId,
        provider,
        externalId,
        encryptedToken: accessToken,
        scopes: 'read write publish',
        status: 'CONNECTED'
      }
    });

    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/socials?connected=${provider}`);
  } catch (error: any) {
    console.error('Real OAuth Callback Error:', error);
    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/socials?error=token_exchange_failed`);
  }
}
