/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments.topLevelAwait = true;
    return config;
  },
  eslint : {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
