import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const blogUrl = new URL(request.url);
  const path = blogUrl.pathname.replace(/^\/blog/, "");
  const proxyUrl = `https://astro-sanity-blog-test.netlify.app${path}${blogUrl.search}`;

  const response = await fetch(proxyUrl, {
    headers: request.headers,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
};
