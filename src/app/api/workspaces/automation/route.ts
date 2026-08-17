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

    const rule = await prisma.automationRule.findFirst({
      where: { workspaceId }
    });

    // Retrieve audit logs from the database
    const auditLogs = await prisma.auditLog.findMany({
      where: { actorId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Format logs for UI Consumption
    const logs = auditLogs.map(log => {
      let status: 'SUCCESS' | 'WARNING' | 'DRAFT_STAGED' = 'SUCCESS';
      if (log.action.includes('FAIL') || log.action.includes('EXPIRE') || log.action.includes('WARNING')) {
        status = 'WARNING';
      } else if (log.action.includes('STAGED') || log.action.includes('DRAFT')) {
        status = 'DRAFT_STAGED';
      }

      let actionDesc = `${log.action} performed on ${log.objectType}`;
      try {
        if (log.metadata) {
          const meta = JSON.parse(log.metadata);
          if (meta.name) {
            actionDesc = meta.name;
          } else if (log.action === 'SAVE_RULES') {
            actionDesc = `Auto-Pilot scheduler rules updated (mode: ${meta.mode}, frequency: ${meta.frequency})`;
          }
        }
      } catch (e) {}

      const date = new Date(log.createdAt);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      return {
        id: log.id,
        time: `${dateStr}, ${timeStr}`,
        action: actionDesc,
        status
      };
    });

    // Fetch active industry
    const bp = await prisma.businessProfile.findUnique({
      where: { workspaceId }
    });
    const industry = bp?.industry || 'Specialty Coffee Retail';

    return NextResponse.json({ rule, logs, industry }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch automation rule:', error);
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

    const body = await req.json();
    const { mode, platforms, frequency, windows } = body;

    const rule = await prisma.automationRule.findFirst({ where: { workspaceId } });

    if (rule) {
      const updated = await prisma.automationRule.update({
        where: { id: rule.id },
        data: { mode, platforms, frequency, windows }
      });
      await prisma.auditLog.create({
        data: {
          actorId: session.id,
          action: 'SAVE_RULES',
          objectType: 'AUTOMATION_RULE',
          objectId: workspaceId,
          metadata: JSON.stringify({ name: `Auto-Pilot rules updated (mode: ${mode}, frequency: ${frequency})`, mode, frequency })
        }
      });
      return NextResponse.json({ rule: updated }, { status: 200 });
    } else {
      const created = await prisma.automationRule.create({
        data: {
          workspaceId,
          mode,
          platforms,
          frequency,
          windows
        }
      });
      await prisma.auditLog.create({
        data: {
          actorId: session.id,
          action: 'SAVE_RULES',
          objectType: 'AUTOMATION_RULE',
          objectId: workspaceId,
          metadata: JSON.stringify({ name: `Auto-Pilot rules created (mode: ${mode}, frequency: ${frequency})`, mode, frequency })
        }
      });
      return NextResponse.json({ rule: created }, { status: 201 });
    }
  } catch (error) {
    console.error('Failed to update automation rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
