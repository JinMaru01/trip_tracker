/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ensures static build
  images: { unoptimized: true },
  experimental: {
    esmExternals: false,
  },
  // Force all routes to be static (use with caution)
  dynamic: 'force-static',
};

export default nextConfig;
