/**
 * Receives form submissions from the site (contact, property enquiry,
 * agent application) and forwards them by email via Resend.
 *
 * Required environment variables (Vercel project settings):
 *   RESEND_API_KEY  — API key from https://resend.com
 *   CONTACT_EMAIL   — address that receives the enquiries
 * Optional:
 *   CONTACT_FROM    — verified sender, e.g. "Sabdia Website <noreply@sabdiaconstructions.com.au>"
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Honeypot: pretend success so bots don't retry
  if (body['bot-field']) {
    return res.status(200).json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    return res.status(500).json({ error: 'Form backend is not configured' });
  }

  const formName = body['form-name'] || 'contact';
  const skip = new Set(['form-name', 'bot-field']);
  const lines = Object.entries(body)
    .filter(([key, value]) => !skip.has(key) && String(value).trim() !== '')
    .map(([key, value]) => `${key}: ${value}`);

  const subjectParts = ['Website enquiry', formName];
  if (body.property) subjectParts.push(body.property);

  const payload = {
    from: process.env.CONTACT_FROM || 'Sabdia Website <onboarding@resend.dev>',
    to: [to],
    subject: subjectParts.join(' — '),
    text: lines.join('\n'),
  };
  if (body.email) payload.reply_to = body.email;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    console.error('Resend error:', resp.status, detail);
    return res.status(502).json({ error: 'Failed to send enquiry' });
  }

  return res.status(200).json({ ok: true });
}
