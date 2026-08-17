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

    const { provider } = await req.json();

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    // Mock OAuth Connection
    const account = await prisma.socialAccount.upsert({
      where: {
        workspaceId_provider_externalId: {
          workspaceId,
          provider,
          externalId: `mock-${provider.toLowerCase()}-id`
        }
      },
      update: {
        status: 'CONNECTED',
        encryptedToken: 'mock-token',
        scopes: 'read write'
      },
      create: {
        workspaceId,
        provider,
        externalId: `mock-${provider.toLowerCase()}-id`,
        encryptedToken: 'mock-token',
        scopes: 'read write',
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
