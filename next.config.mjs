// next.config.mjs
import { getGitVersion } from "./src/utils/getVersion.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["tradeboardjournals.s3.ap-south-1.amazonaws.com"],
  },
  env: {
    APP_VERSION: getGitVersion(),
  },
};

export default nextConfig;
