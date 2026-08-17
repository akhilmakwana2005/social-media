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

    const accounts = await prisma.socialAccount.findMany({
      where: { workspaceId }
    });

    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch social accounts:', error);
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

    const { provider, handle, displayName } = await req.json();

    if (!provider || !handle) {
      return NextResponse.json({ error: 'Provider and handle are required' }, { status: 400 });
    }

    const externalId = handle.trim();
    const scopes = displayName ? displayName.trim() : 'Active Profile';

    // Persistence to Database (registers the custom profile handle / link)
    const account = await prisma.socialAccount.upsert({
      where: {
        workspaceId_provider_externalId: {
          workspaceId,
          provider,
          externalId
        }
      },
      update: {
        status: 'CONNECTED',
        encryptedToken: 'mock-token-xyz',
        scopes
      },
      create: {
        workspaceId,
        provider,
        externalId,
        encryptedToken: 'mock-token-xyz',
        scopes,
        status: 'CONNECTED'
      }
    });

    return NextResponse.json({ account }, { status: 200 });
  } catch (error) {
    console.error('Failed to connect social account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getActiveWorkspace();
    if (!workspace) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    const workspaceId = workspace.id;
    if (!workspaceId) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });

    await prisma.socialAccount.delete({
      where: { id, workspaceId }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete social account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
