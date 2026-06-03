import type { NextConfig } from "next";

// The NestJS backend (apps/backend) does NOT enable CORS, so the browser cannot
// call it cross-origin directly. We proxy requests from the console origin to the
// backend via rewrites: NEXT_PUBLIC_API_BASE_URL defaults to "/api-proxy" and is
// rewritten here to the backend origin. There is no /api or /v1 prefix on the
// backend (verified against source), so we forward paths verbatim.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@blommunity/types",
    "@blommunity/tokens",
    "@blommunity/ui",
    "@blommunity/frontend-core",
  ],
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${BACKEND_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
