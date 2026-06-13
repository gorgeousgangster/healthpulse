/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const mlApiUrl = process.env.ML_API_URL || "http://localhost:8000";
    return [
      {
        source: "/api/ml/:path*",
        destination: `${mlApiUrl}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
