import { NextRequest, NextResponse } from 'next/server';

/**
 * Wildcard Subdomain Middleware
 * 
 * Routes requests like `orion-ai.meudominio.com` to `/site/orion-ai`
 * while keeping the admin panel and API routes accessible on the main domain.
 * 
 * Supports both:
 *  - Subdomain access: `slug.meudominio.com`
 *  - Path access (fallback): `meudominio.com/site/slug`
 */

// Protected paths that should never be rewritten from subdomains
const PROTECTED_PATHS = [
  '/admin',
  '/api',
  '/site',
  '/_next',
  '/favicon.ico',
];

// Subdomains that should be treated as the main domain (not a client page)
const SYSTEM_SUBDOMAINS = ['www', 'admin', 'api', 'app'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Skip middleware in development for localhost without subdomains
  // In dev, subdomains look like: slug.localhost:3000
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Extract the subdomain
  // Production: "orion-ai.meudominio.com" → "orion-ai"
  // Dev: "orion-ai.localhost:3000" → "orion-ai"
  let subdomain: string | null = null;

  if (isLocalhost) {
    // Dev: split by '.' and check if there's a subdomain before 'localhost'
    const parts = hostname.split('.');
    if (parts.length > 1 && !SYSTEM_SUBDOMAINS.includes(parts[0])) {
      subdomain = parts[0];
    }
  } else {
    // Production: "orion-ai.meudominio.com" → parts = ["orion-ai", "meudominio", "com"]
    const parts = hostname.split('.');
    // If we have 3+ parts (subdomain.domain.tld), extract subdomain
    if (parts.length >= 3 && !SYSTEM_SUBDOMAINS.includes(parts[0])) {
      subdomain = parts[0];
    }
  }

  // No subdomain detected → let Next.js handle normally
  if (!subdomain) {
    return NextResponse.next();
  }

  // Don't rewrite protected paths (admin panel, API, static assets)
  const isProtectedPath = PROTECTED_PATHS.some(path => url.pathname.startsWith(path));
  if (isProtectedPath) {
    return NextResponse.next();
  }

  // Only rewrite the root path "/" for subdomain requests
  // This ensures that subdomain.domain.com loads the client landing page
  // but subdomain.domain.com/some-other-path passes through normally
  if (url.pathname === '/') {
    url.pathname = `/site/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and images
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
