import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://warning-machines.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote-form`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Service pages
  const servicePages = [
    '/services/3d-printing-service',
    '/cnc-machining-service',
    '/hardware-design',
    '/pcb-and-firmware',
    '/pre-certification-testing',
    '/firmware',
    '/cad',
    '/electronics',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog articles (using original URLs with /blog prefix)
  const blogArticles = [
    '/blog/firmware',
    '/blog/healthcare-mvp-prototyping',
    '/blog/build-your-product-mvp',
    '/blog/cnc-machines-vs-3d-printer',
    '/blog/build-my-idea',
    '/blog/pcb-design-mistakes',
    '/blog/prototyping-2',
    '/blog/guide-to-cnc-machining',
    '/blog/prototyping',
    '/blog/cnc-machining',
    '/blog/3d-printing',
    '/blog/pcb-developer',
    '/blog/low-volume-manufacturing',
    '/blog/built-custom-electric-bike',
    '/blog/rapid-prototyping',
    '/blog/hardware-product-design',
    '/blog/how-build-a-robot',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...blogArticles];
}
