import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // untuk mengizinkan localhost ip dan domain luar localhost yang akan dihandle sebagai src image
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        // konfigurasi guna untuk mengizinkan localhost ip 
        // ip hostname disetting agar dapat mengizinkan domain dari server luar localhost        
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
