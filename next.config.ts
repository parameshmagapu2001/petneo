// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // you already have this
  images: {
    unoptimized: true, // 👈 disable optimization for static export
  },
};

