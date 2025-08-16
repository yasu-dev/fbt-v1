import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'THE WORLD DOOR API',
    version: '1.0.0'
  });
}











