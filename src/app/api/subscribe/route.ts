import { NextResponse } from 'next/server';
import { saveSubscriber } from '@/lib/store';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  await saveSubscriber({
    email: body.email.trim().toLowerCase(),
    archetype: body.archetype ?? null,
    gender: body.gender ?? null,
    age: body.age ?? null,
  });

  return NextResponse.json({ ok: true });
}
