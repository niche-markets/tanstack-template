import { Context } from "https://edge.netlify.com";

const BLOG_ORIGIN = "https://astro-sanity-blog-test.netlify.app";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  // Remove "/blog" prefix for proxying
  const blogPath = url.pathname.replace(/^\/blog/, "") || "/";
  const proxyUrl = `${BLOG_ORIGIN}${blogPath}${url.search}`;

  // Proxy the request
  const blogResponse = await fetch(proxyUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    redirect: "manual",
  });

  // Rewrite "location" headers for redirects to stay under /blog
  const headers = new Headers(blogResponse.headers);
  const location = headers.get("location");
  if (location && location.startsWith(BLOG_ORIGIN)) {
    headers.set("location", location.replace(BLOG_ORIGIN, "/blog"));
  }

  // Fix asset URLs in HTML responses (optional, for absolute URLs)
  if (
    headers.get("content-type")?.includes("text/html")
  ) {
    let text = await blogResponse.text();
    // Rewrite absolute asset URLs to go through /blog
    text = text.replace(
      new RegExp(BLOG_ORIGIN, "g"),
      "/blog"
    );
    return new Response(text, {
      status: blogResponse.status,
      headers,
    });
  }

  return new Response(blogResponse.body, {
    status: blogResponse.status,
    headers,
  });
};