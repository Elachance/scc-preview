import { generateRegistrationPDF } from './pdf.js';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData.entries());

      const pdfBytes = await generateRegistrationPDF(data);
      const pdfBase64 = uint8ToBase64(pdfBytes);

      const childName = data.childName || 'Unknown';
      await sendEmail(env, pdfBase64, childName);

      return json({ success: true }, request);
    } catch (err) {
      console.error('Worker error:', err);
      return json({ success: false, error: err.message }, request, 500);
    }
  },
};

async function sendEmail(env, pdfBase64, childName) {
  const to = env.RECIPIENT_EMAIL || 'info@silveradochildrenscenter.com';
  const safeName = childName.replace(/[^a-zA-Z0-9\s-]/g, '').trim();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SCC Registration <onboarding@resend.dev>',
      to: [to],
      subject: `Enrollment Registration — ${childName} — SCC`,
      html: `<p>A new enrollment registration has been submitted for <strong>${childName}</strong>.</p><p>Please see the attached Registration Agreement PDF.</p>`,
      attachments: [
        {
          filename: `Registration-${safeName.replace(/\s+/g, '-')}.pdf`,
          content: pdfBase64,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function json(body, request, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
  });
}

function uint8ToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
