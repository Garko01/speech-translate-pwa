import withPWAInit from "next-pwa";

/**
 * Configure next-pwa
 * - Generates service worker for offline support
 * - Disabled in development mode
 */
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/**
 * Next.js configuration for:
 * - React strict mode
 * - Webpack build (disable Turbopack)
 * - Static export for GitHub Pages
 * - Unoptimized images (since GitHub Pages doesn’t support Next Image optimization)
 */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: false, // Use Webpack for compatibility with next-pwa
  },
  eslint: {
    ignoreDuringBuilds: true, // Optional: avoid ESLint blocking deploys
  },
  typescript: {
    ignoreBuildErrors: true, // Optional: prevents build from failing on type errors
  },
};

export default withPWA(nextConfig);
