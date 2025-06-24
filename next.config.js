/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in development to reduce file operations
  productionBrowserSourceMaps: false,
  // Reduce build output
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 