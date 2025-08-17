/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Base path if your app is not served from the root
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Asset prefix for CDN support
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Add support for TypeScript path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
  },
  
  // Enable source maps in production
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;