/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // ✅ New correct key for Next.js 16
  serverExternalPackages: [],

  // ⚙️ You can still keep experimental features here if needed
  experimental: {},
};

export default nextConfig;
