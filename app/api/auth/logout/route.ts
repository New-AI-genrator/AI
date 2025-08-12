import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    // Remove the auth cookie
    await removeAuthCookie();
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
