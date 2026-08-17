export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Mock Mode: No API Key, so we simulate sending an email
    console.log(`\n================= MOCK EMAIL =================`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY:`);
    console.log(html);
    console.log(`==============================================\n`);
    return { success: true, mock: true };
  }

  // Real Mode: Send via Resend REST API (Zero dependencies)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Antigravity <onboarding@resend.dev>', // Use resend test domain by default
        to,
        subject,
        html
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to send email');
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Email sending failed:', err);
    throw err;
  }
}
