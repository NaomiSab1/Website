import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot — silently accept bot submissions without storing them.
  if (body.company_website) return NextResponse.json({ ok: true });

  const { first_name, last_name, email, phone, interest, message } = body;
  if (!first_name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from('form_submissions').insert({
    first_name: String(first_name).slice(0, 200),
    last_name: String(last_name ?? '').slice(0, 200),
    email: String(email).slice(0, 320),
    phone: String(phone ?? '').slice(0, 50),
    interest: String(interest ?? '').slice(0, 200),
    message: String(message).slice(0, 5000),
    source_path: request.headers.get('referer') ?? null,
  });
  if (error) {
    console.error('form insert failed', error);
    return NextResponse.json({ error: 'Storage failed' }, { status: 500 });
  }

  // Forward to lead pipeline + email; failures are logged, never block the lead.
  const lead = { first_name, last_name, email, phone, interest, message, submitted_at: new Date().toISOString() };

  if (process.env.LEADS_WEBHOOK_URL) {
    fetch(process.env.LEADS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch((e) => console.error('lead webhook failed', e));
  }

  if (process.env.RESEND_API_KEY && process.env.LEADS_NOTIFY_EMAIL) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.LEADS_FROM_EMAIL || 'website@sabdiaconstructions.com.au',
        to: process.env.LEADS_NOTIFY_EMAIL,
        subject: `New website enquiry — ${first_name} ${last_name ?? ''}`,
        text: `Name: ${first_name} ${last_name ?? ''}\nEmail: ${email}\nPhone: ${phone ?? '-'}\nInterest: ${interest ?? '-'}\n\n${message}`,
      }),
    }).catch((e) => console.error('lead email failed', e));
  }

  return NextResponse.json({ ok: true });
}
