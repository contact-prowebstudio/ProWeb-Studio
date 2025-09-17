import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rateLimit';

// Bot detection patterns
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'scanner', 'curl', 'wget',
  'python-requests', 'go-http-client', 'libwww-perl', 'postmanruntime'
];

const SUSPICIOUS_PATTERNS = [
  /eval\(/i, /javascript:/i, /<script/i, /onload=/i, /onclick=/i,
  /\bexec\b/i, /\bsystem\b/i, /\.\.\/\.\.\//i, /\bunion\b.*\bselect\b/i
];

function getClientIP(req: NextRequest): string {
  // Check various headers for real IP
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const xRealIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  if (xRealIp) return xRealIp;
  if (cfConnectingIp) return cfConnectingIp;
  
  return req.ip || 'unknown';
}

async function isRateLimitedEdge(ip: string, path: string) {
  const key = `${ip}:${path.startsWith('/api/') ? 'api' : 'html'}`;
  const { success } = await rateLimiter.limit(key);
  return !success;
}

function detectBot(userAgent: string): boolean {
  if (!userAgent) return true; // No user agent is suspicious
  
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function detectSuspiciousContent(req: NextRequest): boolean {
  const url = req.nextUrl.toString();
  const userAgent = req.headers.get('user-agent') || '';
  
  // Check URL for suspicious patterns
  if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(url))) {
    return true;
  }
  
  // Check User-Agent for suspicious patterns
  if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(userAgent))) {
    return true;
  }
  
  // Check for common attack vectors
  const searchParams = req.nextUrl.searchParams.toString();
  if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(searchParams))) {
    return true;
  }
  
  return false;
}

function validateRequest(req: NextRequest): { valid: boolean; reason?: string } {
  const userAgent = req.headers.get('user-agent') || '';
  const referer = req.headers.get('referer');
  const origin = req.headers.get('origin');
  
  // Check for missing critical headers on POST requests
  if (req.method === 'POST') {
    if (!origin && !referer) {
      return { valid: false, reason: 'Missing origin and referer headers' };
    }
    
    // Validate origin for API requests
    if (req.nextUrl.pathname.startsWith('/api/')) {
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'https://prowebstudio.nl',
        'https://www.prowebstudio.nl'
      ];
      // Allow Vercel preview deployments
      const isVercelPreview = origin?.endsWith('.vercel.app');
      
      if (origin && !isVercelPreview && !allowedOrigins.includes(origin)) {
        return { valid: false, reason: 'Invalid origin' };
      }
    }
  }
  
  // Check User-Agent length (too short or too long is suspicious)
  if (userAgent.length < 10 || userAgent.length > 500) {
    return { valid: false, reason: 'Suspicious user agent length' };
  }
  
  return { valid: true };
}

function createSecurityHeaders(): Record<string, string> {
  const nonce = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  
  return {
    // Only keep non-duplicated headers here
    // All security headers are now handled in next.config.mjs
    
    // Nonce for inline scripts (unique per request)
    'X-Nonce': nonce
  };
}

export async function middleware(req: NextRequest) {
  const ip = getClientIP(req);
  const path = req.nextUrl.pathname;
  const userAgent = req.headers.get('user-agent') || '';
  
  // Skip middleware for static files and Next.js internals
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path.includes('.') && !path.includes('/api/')
  ) {
    return NextResponse.next();
  }

  // 1. Bot Detection
  if (detectBot(userAgent) && !path.startsWith('/api/')) {
    // Allow bots for SEO but block from sensitive areas
    if (path.includes('admin') || path.includes('dashboard')) {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }
  
  // 2. Suspicious Content Detection
  if (detectSuspiciousContent(req)) {
    console.warn(`Suspicious request blocked: ${ip} ${path}`);
    return new NextResponse('Bad Request', { status: 400 });
  }
  
  // 3. Request Validation
  const validation = validateRequest(req);
  if (!validation.valid) {
    console.warn(`Invalid request blocked: ${ip} ${path} - ${validation.reason}`);
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // 4. Rate Limiting
  if (await isRateLimitedEdge(ip, path)) {
    console.warn(`Rate limit exceeded: ${ip} ${path}`);
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '10', // 10 seconds
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Date.now() + 10000).toString()
      }
    });
  }
  
  // 5. Apply Security Headers
  const response = NextResponse.next();
  const securityHeaders = createSecurityHeaders();
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Note: API headers (X-API-Version, Cache-Control, Pragma, Expires) are now
  // exclusively handled in next.config.mjs under async headers() for /api/:path*
  // to avoid duplication and ensure single source of truth
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|assets|fonts|images|api/csp-report).*)',
  ],
};
