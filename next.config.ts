import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Contributor avatars on tool pages.
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
  async redirects() {
    // Tools were called projects before; keep old links working.
    return [
      { source: "/:locale(en|fr)/projects", destination: "/:locale/tools", permanent: true },
      { source: "/:locale(en|fr)/projects/:slug", destination: "/:locale/tools/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
