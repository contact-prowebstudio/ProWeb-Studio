import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const preferredRegion = 'fra1';

export async function POST(req: NextRequest) {
  try {
    const report = await req.json();
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Log CSP violation for monitoring
    console.warn('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      clientIP,
      userAgent: req.headers.get('user-agent')?.substring(0, 200),
      report: {
        blockedURI: report['blocked-uri'],
        documentURI: report['document-uri'],
        violatedDirective: report['violated-directive'],
        originalPolicy: report['original-policy']?.substring(0, 500), // Truncate long policies
        sourceFile: report['source-file'],
        lineNumber: report['line-number'],
        columnNumber: report['column-number']
      }
    });
    
    // In production, you might want to:
    // 1. Store reports in a database
    // 2. Send alerts for critical violations
    // 3. Aggregate reports for analysis
    // 4. Filter out known false positives
    
    const res = NextResponse.json({ received: true }, { status: 204 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (error) {
    console.error('CSP Report parsing error:', error);
    const res = NextResponse.json({ error: 'Invalid report' }, { status: 400 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
