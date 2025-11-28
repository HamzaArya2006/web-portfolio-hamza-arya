export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  // Basic in-memory rate limiting per IP (best-effort)
  const ip =
    (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  globalThis.__rateLimiter = globalThis.__rateLimiter || new Map();
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxReq = 10; // 10 requests per minute per IP
  const bucket = globalThis.__rateLimiter.get(ip) || [];
  const recent = bucket.filter((t) => now - t < windowMs);
  recent.push(now);
  globalThis.__rateLimiter.set(ip, recent);
  if (recent.length > maxReq) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  let body;
  try {
    body = req.body || {};
    if (!body || typeof body !== 'object') throw new Error('Invalid body');
  } catch (_) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { name, email, brief, budget, website, _ts } = body;

  // Honeypot: should be empty
  if (website && String(website).trim() !== '') {
    return res.status(204).end();
  }

  // Minimal timing-based anti-bot: require form to be open for N ms
  const minMs = Number(process.env.FORMS_MIN_SUBMIT_MS || 3000);
  const ts = Number(_ts || 0);
  if (!ts || now - ts < minMs) {
    return res.status(400).json({ error: 'Form submitted too quickly' });
  }

  // Validate required fields
  if (!name || !email || !brief) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = String(email).trim();
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Validate input lengths to prevent DoS
  const MAX_LENGTHS = {
    name: 100,
    email: 255,
    brief: 5000,
    budget: 100
  };

  const trimmedName = String(name).trim();
  const trimmedBrief = String(brief).trim();
  const trimmedBudget = budget ? String(budget).trim() : '';

  if (trimmedName.length > MAX_LENGTHS.name) {
    return res.status(400).json({ error: 'Name is too long' });
  }
  if (trimmedEmail.length > MAX_LENGTHS.email) {
    return res.status(400).json({ error: 'Email is too long' });
  }
  if (trimmedBrief.length > MAX_LENGTHS.brief) {
    return res.status(400).json({ error: 'Brief is too long' });
  }
  if (trimmedBudget && trimmedBudget.length > MAX_LENGTHS.budget) {
    return res.status(400).json({ error: 'Budget is too long' });
  }

  // Optional: forward to a webhook (Slack, Discord, Make/Zapier, etc.)
  const webhook = process.env.FORMS_WEBHOOK_URL;
  if (webhook) {
    try {
      // Sanitize values before sending to webhook
      const sanitizedName = String(name).trim().substring(0, 100);
      const sanitizedEmail = trimmedEmail;
      const sanitizedBrief = trimmedBrief.substring(0, 5000);
      const sanitizedBudget = trimmedBudget ? trimmedBudget.substring(0, 100) : null;
      
      const payload = {
        text: `New Inquiry\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nBudget: ${sanitizedBudget || '-'}\nBrief: ${sanitizedBrief}`,
        name: sanitizedName,
        email: sanitizedEmail,
        budget: sanitizedBudget,
        brief: sanitizedBrief,
        ip,
        userAgent: req.headers['user-agent'] || '',
        submittedAt: new Date().toISOString(),
      };
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Webhook forwarding failed:', err);
      // continue; do not expose details to client
    }
  }

  return res.status(200).json({ ok: true });
}


