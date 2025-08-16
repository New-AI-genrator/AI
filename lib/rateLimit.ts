import { NextRequest, NextResponse } from 'next/server';

// Store rate limit data in memory (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  requests: number;
  windowMs: number;
  message?: string;
  identifier: (req: NextRequest) => string;
}

export function rateLimit(options: RateLimitOptions) {
  const { requests, windowMs, message = 'Too many requests, please try again later', identifier } = options;

  return (req: NextRequest) => {
    const id = identifier(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    rateLimitMap.forEach((value, key) => {
      if (value.resetTime < windowStart) {
        rateLimitMap.delete(key);
      }
    });

    // Get or create rate limit entry
    const entry = rateLimitMap.get(id) || { count: 0, resetTime: now + windowMs };
    
    // Check if rate limit is exceeded
    if (entry.count >= requests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return new NextResponse(
        JSON.stringify({ error: message }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': requests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      );
    }

    // Update rate limit
    entry.count++;
    rateLimitMap.set(id, entry);

    // Return null to indicate the request should proceed
    return null;
  };
}

// Rate limit by IP address
export const rateLimitByIp = (req: NextRequest) => {
  const rateLimitFn = rateLimit({
    requests: 100, // 100 requests per window
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again later',
    identifier: (req: NextRequest) => {
      // Get the IP address from the request headers (Next.js 15 compatible)
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      return `ip:${Array.isArray(ip) ? ip[0] : ip}`;
    },
  });
  
  return rateLimitFn(req);
};
