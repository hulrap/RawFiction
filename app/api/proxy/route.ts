import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Validate URL
    const url = new URL(targetUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
    }

    // Fetch the target website
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch website' }, { status: response.status });
    }

    const content = await response.text();

    // Modify the HTML to fix relative URLs and remove X-Frame-Options
    const modifiedContent = content
      .replace(/href="\/(?!\/)/g, `href="${url.origin}/`)
      .replace(/src="\/(?!\/)/g, `src="${url.origin}/`)
      .replace(/action="\/(?!\/)/g, `action="${url.origin}/`)
      .replace(/<meta[^>]*http-equiv="X-Frame-Options"[^>]*>/gi, '')
      .replace(/<meta[^>]*name="viewport"[^>]*>/gi, '<meta name="viewport" content="width=device-width, initial-scale=1">');

    return new NextResponse(modifiedContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': 'frame-ancestors *;',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
