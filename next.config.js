
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com'],
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, webpack }
  ) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
}

module.exports = nextConfig
