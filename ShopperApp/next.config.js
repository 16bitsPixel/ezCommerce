/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack: (config) => {
    config.experiments.topLevelAwait = true;
    return config;
  },
}

module.exports = nextConfig
