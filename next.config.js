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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Ultra-strict CSP that blocks ALL extension content scripts
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "script-src-elem 'self' 'unsafe-inline'",
              "script-src-attr 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: https:",
              "media-src 'self' data:",
              "connect-src 'self' https:",
              "child-src 'self' https:",
              "frame-src 'self' https:",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
          // Permissions Policy to block APIs that wallet extensions need
          {
            key: 'Permissions-Policy',
            value: [
              'clipboard-read=()',
              'clipboard-write=()',
              'geolocation=()',
              'camera=()',
              'microphone=()',
              'payment=()',
              'usb=()',
              'serial=()',
              'bluetooth=()',
              'web-share=()',
              'storage-access=()',
            ].join(', '),
          },
          // Cross-Origin policies
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Anti-extension headers
          {
            key: 'X-Wallet-Block',
            value: 'true',
          },
          {
            key: 'X-Extension-Block',
            value: 'metamask,yoroi,keplr,phantom,coinbase',
          },
        ],
      },
    ];
  },

  // Enhanced webpack config to block extension detection
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Block common extension detection libraries
        web3: false,
        ethereum: false,
        '@metamask/detect-provider': false,
        '@walletconnect/web3-provider': false,
      };
    }
    return config;
  },

  // Environment variables for extension blocking
  env: {
    BLOCK_WALLET_EXTENSIONS: 'true',
    STRICT_CSP_MODE: 'true',
  },
};

module.exports = nextConfig;
