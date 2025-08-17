import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { corsMiddleware } from '@/lib/cors';

// Domain redirect configuration
const PRODUCTION_DOMAIN = 'aitoolkit.vercel.app';
const OLD_DOMAINS = [
  'aivault-nu.vercel.app',
  // Add any other old domains that should redirect to the main domain
];

// Rate limiting configuration
const RATE_LIMIT = 100; // Default requests per window
const AUTH_RATE_LIMIT = 5; // Stricter limit for auth endpoints
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Rate limit store interface
interface RateLimitInfo {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

// Simple in-memory store for rate limiting (consider Redis for production)
const rateLimits = new Map<string, RateLimitInfo>();

// Paths that should have stricter rate limiting
const STRICT_PATHS = [
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/2fa/verify',
  '/api/auth/2fa/setup',
  '/api/auth/2fa/disable',
  '/api/auth/2fa/login-verify'
];

// CSRF token validation
function validateCsrfToken(request: NextRequest): boolean {
  // Skip CSRF for GET/HEAD/OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }

  // Skip CSRF for public endpoints
  const { pathname } = request.nextUrl;
  if (pathname.endsWith('/login') || pathname.endsWith('/signup')) {
    return true;
  }

  // Get CSRF token from header or form data
  const csrfToken = request.headers.get('x-csrf-token') || 
                   (request.headers.get('content-type')?.includes('application/json') 
                     ? (request.json() as any)?._csrf 
                     : null);

  // In a real app, you would validate this token against the one in the session
  // For simplicity, we'll just check if it exists
  return !!csrfToken;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const isPreviewDomain = host.endsWith('.vercel.app') && !host.endsWith(PRODUCTION_DOMAIN);
  
  // Skip redirect for static files, _next, and API routes
  const isStaticAsset = 
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/);
  
  // Only redirect main page requests from preview domains
  if (!isStaticAsset && (OLD_DOMAINS.includes(host) || isPreviewDomain)) {
    const url = new URL(request.url);
    url.hostname = PRODUCTION_DOMAIN;
    
    // For preview domains, use a temporary redirect (302) instead of permanent (301)
    const statusCode = OLD_DOMAINS.includes(host) ? 301 : 302;
    return NextResponse.redirect(url.toString(), statusCode);
  }

  // Handle CORS first
  const corsResponse = corsMiddleware(request);
  if (corsResponse) {
    return corsResponse;
  }

  // Use the existing pathname from above
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Clean up old rate limit entries
  rateLimits.forEach((value, key) => {
    if (value.resetTime < windowStart) {
      rateLimits.delete(key);
    }
  });

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const isStrictPath = STRICT_PATHS.some(path => pathname.startsWith(path));
    const limit = isStrictPath ? AUTH_RATE_LIMIT : RATE_LIMIT;
    const rateLimitKey = isStrictPath ? `strict:${ip}` : `api:${ip}`;
    
    // Check if IP is blocked
    const blockedInfo = rateLimits.get(`blocked:${ip}`);
    if (blockedInfo && blockedInfo.blockedUntil && blockedInfo.blockedUntil > now) {
      const retryAfter = Math.ceil((blockedInfo.blockedUntil - now) / 1000);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
        }), 
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString()
          }
        }
      );
    }
    // Get or initialize rate limit info
    const rateLimitInfo = rateLimits.get(rateLimitKey) || { 
      count: 0, 
      resetTime: now + RATE_LIMIT_WINDOW_MS 
    };

    // Check if window has passed, reset count if needed
    if (now > rateLimitInfo.resetTime) {
      rateLimitInfo.count = 0;
      rateLimitInfo.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }

    // Increment request count
    rateLimitInfo.count += 1;
    rateLimits.set(rateLimitKey, rateLimitInfo);

    // Calculate remaining requests and reset time
    const remaining = Math.max(0, limit - rateLimitInfo.count);
    const resetTime = Math.ceil(rateLimitInfo.resetTime / 1000);

    // Create response object
    const response = NextResponse.next();
    
    // Set rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());

    // Check if rate limit exceeded
    if (rateLimitInfo.count > limit) {
      // Block IP for 1 hour if too many auth attempts
      if (isStrictPath) {
        rateLimits.set(`blocked:${ip}`, {
          count: 0,
          resetTime: 0,
          blockedUntil: now + (60 * 60 * 1000) // 1 hour block
        });
      }
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests',
          message: isStrictPath 
            ? 'Too many login attempts. Please try again later.'
            : 'Rate limit exceeded. Please try again later.'
        }), 
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': isStrictPath ? '3600' : '900',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toString()
          }
        }
      );
    }

    return response;
  }

  // Apply CSRF protection to non-GET API routes
  if (pathname.startsWith('/api/') && request.method !== 'GET') {
    if (!validateCsrfToken(request)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP Header - adjust based on your needs
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
