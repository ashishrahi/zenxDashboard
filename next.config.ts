/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  serverActions: {
    bodySizeLimit: "10mb", // increase limit as needed
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // allow all Cloudinary paths
      },
    ],
  },
};

module.exports = nextConfig;
