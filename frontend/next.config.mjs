/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Ensures better debugging
    eslint: {
      ignoreDuringBuilds: true, // Disable ESLint khi build production
    },
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          poll: 1000, // Check for changes every second
          aggregateTimeout: 300, // Delay rebuilds slightly to optimize performance
        };
      }
      return config;
    },
};

export default nextConfig;
