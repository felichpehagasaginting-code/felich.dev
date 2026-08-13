import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'development') {
    return new NextResponse('self.addEventListener("install", () => self.skipWaiting()); self.addEventListener("activate", () => self.clients.claim());', {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
  return new NextResponse(null, { status: 404 });
}
