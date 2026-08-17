import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { type } = await req.json();

    let subject = 'Hello from Antigravity!';
    let html = `<h1>Welcome to Antigravity</h1><p>This is a test notification.</p>`;

    if (type === 'WELCOME') {
      subject = 'Welcome to your AI Social Media Assistant! 🚀';
      html = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Welcome to Antigravity, ${user.name || 'Creator'}!</h2>
          <p>We are thrilled to have you on board. Your AI Social Media assistant is ready to help you scale your brand.</p>
          <p>Next steps:</p>
          <ul>
            <li>Fill out your <b>Brand Kit</b></li>
            <li>Connect your <b>Social Accounts</b></li>
            <li>Generate your first <b>AI Post</b></li>
          </ul>
          <br/>
          <p>Best regards,<br/>The Antigravity Team</p>
        </div>
      `;
    }

    const result = await sendEmail({
      to: user.email,
      subject,
      html
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
