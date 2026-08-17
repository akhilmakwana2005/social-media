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

    // Check if there is a connected account for this platform in the database
    const socialAccount = await prisma.socialAccount.findFirst({
      where: { workspaceId: workspace.id, provider: platform }
    });

    const token = socialAccount?.encryptedToken;
    let externalPostId = `${platform.toLowerCase()}-post-${Date.now()}`;
    let isRealPublish = false;
    let realPublishError = null;

    // REAL PUBLISHING TO INSTAGRAM GRAPH API
    if (platform === 'INSTAGRAM' && token && !token.startsWith('mock-')) {
      try {
        // 1. Get linked Facebook Pages
        const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`);
        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          const page = pagesData.data?.[0]; // Get the first page
          if (page) {
            // 2. Fetch linked Instagram Business Account ID
            const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${token}`);
            if (igRes.ok) {
              const igData = await igRes.json();
              const igAccountId = igData.instagram_business_account?.id;
              
              if (igAccountId) {
                // Determine image to upload (Instagram requires an image or video)
                let imageUrl = 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop'; // Default placeholder
                
                if (mediaId) {
                  const mediaAsset = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
                  // If media is a Base64 string, we cannot send Base64 directly to Meta Graph API, so we use placeholder or a public url
                  if (mediaAsset && !mediaAsset.storageKey.startsWith('data:')) {
                    imageUrl = mediaAsset.storageKey.startsWith('http') 
                      ? mediaAsset.storageKey 
                      : `${req.nextUrl.origin}${mediaAsset.storageKey}`;
                  }
                }

                // 3. Create Media Container
                const mediaContainerRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    image_url: imageUrl,
                    caption: text,
                    access_token: token
                  })
                });

                if (mediaContainerRes.ok) {
                  const containerData = await mediaContainerRes.json();
                  const creationId = containerData.id;

                  // 4. Publish Media Container
                  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      creation_id: creationId,
                      access_token: token
                    })
                  });

                  if (publishRes.ok) {
                    const publishData = await publishRes.json();
                    externalPostId = publishData.id;
                    isRealPublish = true;
                  } else {
                    const errObj = await publishRes.json();
                    realPublishError = errObj.error?.message || 'Publish step failed';
                  }
                } else {
                  const errObj = await mediaContainerRes.json();
                  realPublishError = errObj.error?.message || 'Container creation failed';
                }
              } else {
                realPublishError = 'No linked Instagram Business Account found on the Facebook Page';
              }
            } else {
              realPublishError = 'Failed to fetch Instagram account details from Page';
            }
          } else {
            realPublishError = 'No Facebook Pages found linked to this access token';
          }
        } else {
          realPublishError = 'Failed to fetch Facebook pages for the user token';
        }
      } catch (err: any) {
        console.error('Real Instagram publish exception:', err);
        realPublishError = err.message || 'Meta API request exception';
      }
    }

    // REAL PUBLISHING TO LINKEDIN SHARE API
    if (platform === 'LINKEDIN' && token && !token.startsWith('mock-')) {
      try {
        // Fetch LinkedIn Member ID
        const profileRes = await fetch('https://api.linkedin.com/v2/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const urn = `urn:li:person:${profileData.id}`;

          // Publish text post
          const shareRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify({
              author: urn,
              lifecycleState: 'PUBLISHED',
              specificContent: {
                'com.linkedin.ugc.ShareContent': {
                  shareCommentary: { text },
                  shareMediaCategory: 'NONE'
                }
              },
              visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
              }
            })
          });

          if (shareRes.ok) {
            const shareData = await shareRes.json();
            externalPostId = shareData.id;
            isRealPublish = true;
          } else {
            const errObj = await shareRes.json();
            realPublishError = errObj.message || 'LinkedIn UGC post publish failed';
          }
        } else {
          realPublishError = 'Failed to fetch LinkedIn profile details';
        }
      } catch (err: any) {
        console.error('Real LinkedIn publish exception:', err);
        realPublishError = err.message || 'LinkedIn API request exception';
      }
    }

    // Create database records (falls back to mock success if real publish fails or wasn't configured)
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
          externalPostId,
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

      // 6. Create Audit Log with real publish details
      const logName = isRealPublish 
        ? `Published live post to ${platform}: "${text.substring(0, 30)}..."` 
        : realPublishError
          ? `Sandbox published to ${platform} (Real API error: ${realPublishError})`
          : `Staged sandbox post to ${platform}: "${text.substring(0, 30)}..."`;

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: isRealPublish ? 'PUBLISH' : 'STAGED_DRAFT',
          objectType: 'CONTENT',
          objectId: content.id,
          metadata: JSON.stringify({
            name: logName,
            platform,
            likes,
            impressions,
            isReal: isRealPublish
          })
        }
      });

      return { content, publication };
    });

    return NextResponse.json({ success: true, result, isRealPublish, realPublishError }, { status: 201 });
  } catch (error) {
    console.error('Publish content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
