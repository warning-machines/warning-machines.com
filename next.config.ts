import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Blog article redirects (original URLs → /blog/slug)
      {
        source: '/3d-printing',
        destination: '/blog/3d-printing',
        permanent: true,
      },
      {
        source: '/hardware-product-design',
        destination: '/blog/hardware-product-design',
        permanent: true,
      },
      {
        source: '/pcb-developer',
        destination: '/blog/pcb-developer',
        permanent: true,
      },
      {
        source: '/build-my-idea',
        destination: '/blog/build-my-idea',
        permanent: true,
      },
      {
        source: '/healthcare-mvp-prototyping',
        destination: '/blog/healthcare-mvp-prototyping',
        permanent: true,
      },
      {
        source: '/cnc-machines-vs-3d-printer',
        destination: '/blog/cnc-machines-vs-3d-printer',
        permanent: true,
      },
      {
        source: '/built-custom-electric-bike',
        destination: '/blog/built-custom-electric-bike',
        permanent: true,
      },
      {
        source: '/cnc-machining',
        destination: '/blog/cnc-machining',
        permanent: true,
      },
      {
        source: '/firmware',
        destination: '/blog/firmware',
        permanent: true,
      },
      {
        source: '/build-your-product-mvp',
        destination: '/blog/build-your-product-mvp',
        permanent: true,
      },
      {
        source: '/low-volume-manufacturing',
        destination: '/blog/low-volume-manufacturing',
        permanent: true,
      },
      {
        source: '/prototyping-2',
        destination: '/blog/prototyping-2',
        permanent: true,
      },
      {
        source: '/rapid-prototyping',
        destination: '/blog/rapid-prototyping',
        permanent: true,
      },
      {
        source: '/how-build-a-robot',
        destination: '/blog/how-build-a-robot',
        permanent: true,
      },
      {
        source: '/guide-to-cnc-machining',
        destination: '/blog/guide-to-cnc-machining',
        permanent: true,
      },
      {
        source: '/pcb-design-mistakes',
        destination: '/blog/pcb-design-mistakes',
        permanent: true,
      },
      {
        source: '/prototyping',
        destination: '/blog/prototyping',
        permanent: true,
      },
      // Service page merges
      {
        source: '/services/cnc-machining',
        destination: '/services/cad',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
