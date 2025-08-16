import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { UserWithoutPassword } from '@/types/user';

// Type for cookie options
interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

const COOKIE_NAME = 'auth-token';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '30d';

type CookieStore = ReturnType<typeof cookies>;

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(user: UserWithoutPassword): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
  
  return token;
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<UserWithoutPassword | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!token) return null;
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return payload as unknown as UserWithoutPassword;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function verifyToken(token: string): Promise<UserWithoutPassword | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserWithoutPassword;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
