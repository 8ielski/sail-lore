import type { NextConfig } from "next";

/**
 * Static export for the Cloudflare Pages review deploy.
 *
 * The site has no API routes, no server actions, no revalidation and no
 * next/image — every note's body already ships in the bundle — so it exports
 * cleanly. `/notes/[id]` is fully enumerated by generateStaticParams, so
 * dynamicParams is off: an unknown id is a build-time absence and a 404 from
 * the host, which is what it was on the server too.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
