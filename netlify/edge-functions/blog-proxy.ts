import { Context } from "https://edge.netlify.com";

const BLOG_ORIGIN = "https://astro-sanity-blog-test.netlify.app";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const blogPath = url.pathname.replace(/^\/blog/, "");
  const targetUrl = `${BLOG_ORIGIN}${blogPath}`;

  const response = await fetch(targetUrl, {
    headers: {
      ...request.headers,
      host: new URL(targetUrl).host,
    },
  });

  // Clone response
  const newHeaders = new Headers(response.headers);
  newHeaders.set("X-Served-By", "EdgeFunctionProxy");
  // Optional: adjust CSP here if needed

  return new Response(await response.body, {
    status: response.status,
    headers: newHeaders,
  });
};