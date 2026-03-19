/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  basePath: '',
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'nftstorage.link'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.io',
      },
    ],
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'src', 'routes', 'store', 'types', 'utils', 'hooks', 'models', 'context'],
    ignoreDuringBuilds: false
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_ORIGIN || process.env.VERCEL_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Ivao-Auth'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
