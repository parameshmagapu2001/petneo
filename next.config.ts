// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'unbiased-dane-new.ngrok-free.app',
              port: '',
              pathname: '/uploads/**',
          },
      ],
    unoptimized: true, // 👈 disable optimization for static export
  },
};

export default nextConfig;

