import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  // 👇 Add this to use Webpack instead of Turbopack
  experimental: {
    turbo: false,
  },
};

export default withPWA(nextConfig);
