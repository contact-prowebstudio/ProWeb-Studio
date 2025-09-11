// @ts-check

import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable powered by header for security
  poweredByHeader: false,
  
  // Enable React 18 features
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // PWA and Service Worker
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/_next/static/chunks/sw.js',
      },
    ];
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize chunk splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -5,
            reuseExistingChunk: true,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            priority: 10,
            chunks: 'async',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Compression
  compress: true,
  
  // Output optimization
  output: 'standalone',

  async headers() {
    return [
      {
        // Immutable caching for static assets by extension
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|css|js|mjs|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          // Enhanced HSTS with preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Frame protection
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Content type protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Enhanced referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // XSS Protection (legacy but still useful)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Cross-domain policies
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          // Cross-Origin policies
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // Custom security headers
          { key: 'X-Security-Version', value: '2.0' },
          { key: 'X-Content-Options', value: 'noopen' },
          { key: 'X-Download-Options', value: 'noopen' },
          // Cache control for general pages
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400' },
        ],
      },
      // Static assets - long cache with immutable
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      // API routes - no cache, enhanced security
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, private' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-API-Version', value: '2.0' },
          { key: 'Vary', value: 'Origin, Accept-Encoding' },
        ],
      },
      // Next.js static files - long cache
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      // Security-sensitive files
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      // PWA files
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      // Contact form specific headers
      {
        source: '/contact',
        headers: [
          { 
            key: 'Content-Security-Policy-Report-Only', 
            value: [
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://plausible.io",
              "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://plausible.io",
              "frame-src https://www.google.com",
              "img-src 'self' data: https: https://*.googleusercontent.com",
              "report-uri /api/csp-report"
            ].join('; ')
          },
          { key: 'Expect-CT', value: 'max-age=86400, enforce' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
