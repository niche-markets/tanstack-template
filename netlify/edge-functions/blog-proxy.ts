import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const incomingUrl = new URL(request.url);
  const path = incomingUrl.pathname.replace(/^\/blog/, "") || "/";
  const search = incomingUrl.search || "";
  const proxyUrl = `https://astro-sanity-blog-test.netlify.app${path}${search}`;

  const response = await fetch(proxyUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    redirect: "manual",
  });

  // Remove or rewrite "location" header for redirects if needed
  const headers = new Headers(response.headers);
  const location = headers.get("location");
  if (location && location.startsWith("https://astro-sanity-blog-test.netlify.app")) {
    headers.set("location", location.replace("https://astro-sanity-blog-test.netlify.app", "/blog"));
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  });
};