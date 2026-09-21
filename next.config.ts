import type { NextConfig } from "next";

const s3BaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: s3BaseUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(s3BaseUrl).hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
