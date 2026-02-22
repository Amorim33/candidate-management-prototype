import { resetStorage } from '@/data/storage';
import { NextResponse } from 'next/server';

export async function POST() {
  resetStorage();
  return NextResponse.json({ ok: true });
}
