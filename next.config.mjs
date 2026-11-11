/** @type {import('next').NextConfig} */
const nextConfig = {
  // Served at madarth.com/newsletters through a rewrite on the main madarth
  // Vercel project, so every route and asset lives under this base path.
  basePath: '/newsletters',
};

export default nextConfig;
