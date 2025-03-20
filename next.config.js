// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure webpack to handle Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },
  // Output directory configuration for better Vercel compatibility
  output: 'standalone',
  // Enable strict mode for better error detection
  typescript: {
    // Don't fail production builds if types are wrong
    ignoreBuildErrors: true,
  },
  eslint: {
    // Don't fail production builds if ESLint finds errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig