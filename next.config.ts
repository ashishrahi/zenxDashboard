/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  serverActions: {
    bodySizeLimit: "10mb", // increase limit as needed
  },
};

module.exports = nextConfig;
