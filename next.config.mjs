/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["tradeboardjournals.s3.ap-south-1.amazonaws.com"],
  },
};

export default nextConfig;
