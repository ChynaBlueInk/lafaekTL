/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.v0.dev",   // keep your existing allowance
      },
      {
        protocol: "https",
        hostname: "lafaek-media.s3.ap-southeast-2.amazonaws.com",
        pathname: "/uploads/**", // allow your S3 uploads
      },
      // optional future CloudFront CDN:
      // {
      //   protocol: "https",
      //   hostname: "dxxxxxxxxxxxx.cloudfront.net",
      //   pathname: "/uploads/**",
      // }
    ],
    unoptimized: true,
  },
};

export default nextConfig;
