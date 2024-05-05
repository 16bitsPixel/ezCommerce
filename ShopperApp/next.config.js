/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  reactStrictMode: true,
  i18n,  // i18n configuration imported from next-i18next.config.js
  webpack: (config) => {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;