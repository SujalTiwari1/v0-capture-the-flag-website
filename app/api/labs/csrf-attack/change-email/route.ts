import { NextResponse } from 'next/server';

const FLAG = 'flag{csrf_protected}';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || 'pwned@example.com');

  // Only reveal the flag when the request is triggered from a different page (CSRF simulation).
  // Same-origin form submission from the victim dashboard does not count as CSRF.
  const referer = request.headers.get('referer') ?? '';
  const isCrossSiteStyleRequest =
    !referer.includes('csrf-attack') ||
    referer.includes('csrf-attack/attacker') ||
    referer.includes('attacker=1');

  return NextResponse.json({
    success: true,
    message: isCrossSiteStyleRequest
      ? `Email changed (simulated) to ${email}. CSRF demonstrated — no token was required.`
      : `Email changed to ${email}. This request came from the legitimate form; the flag is only revealed when the change is triggered from another page (e.g. an attacker's page).`,
    flag: isCrossSiteStyleRequest ? FLAG : undefined,
  });
}
