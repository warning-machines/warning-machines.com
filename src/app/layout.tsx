import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './blog/blog.css';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { Providers } from './providers';

const siteTitle = 'WARNING MACHINES | Prototyping, CNC, 3D Printing, PCB';
const siteDescription =
  'Turn your ideas into reality. WARNING MACHINES provides comprehensive CNC, 3D Printing, & PCB development services for tech companies in Europe & the USA.';
const ogImage = 'https://warning-machines.com/images/2025/06/cropped-warning-icon-2.png';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Place',
      '@id': 'https://warning-machines.com/#place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. "20-ti April" 13',
        addressLocality: 'Sofia',
        addressRegion: 'Sofia City Province',
        postalCode: '1606',
        addressCountry: 'BG',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://warning-machines.com/#organization',
      name: 'Warning Machines',
      url: 'https://warning-machines.com',
      sameAs: ['https://www.linkedin.com/company/warning-machines'],
      email: 'm_emadian@warning-machines.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. "20-ti April" 13',
        addressLocality: 'Sofia',
        addressRegion: 'Sofia City Province',
        postalCode: '1606',
        addressCountry: 'BG',
      },
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://warning-machines.com/#logo',
        url: ogImage,
        contentUrl: ogImage,
        caption: 'Warning Machines',
        inLanguage: 'en-US',
        width: '512',
        height: '512',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+3590889231070',
          contactType: 'customer support',
        },
      ],
      description:
        'WARNING MACHINES is a global engineering partner that turns visionary ideas into commercially viable products. Our cross-disciplinary team excels in Engineering Design & Product Development, Rapid Prototyping, Embedded Systems & PCB Design, and Turnkey Assembly. From consumer electronics and medical devices to aerospace, automotive and industrial automation, we provide end-to-end expertise that accelerates time-to-market while safeguarding your IP.',
      legalName: 'Warning Machines OOD',
      foundingDate: '2021',
      numberOfEmployees: { '@type': 'QuantitativeValue', value: '10' },
      location: { '@id': 'https://warning-machines.com/#place' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://warning-machines.com/#website',
      url: 'https://warning-machines.com',
      name: 'Warning Machines',
      alternateName: 'WM',
      publisher: { '@id': 'https://warning-machines.com/#organization' },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://warning-machines.com/?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ImageObject',
      '@id': 'https://warning-machines.com/wp-content/uploads/2025/06/warning.svg',
      url: 'https://warning-machines.com/wp-content/uploads/2025/06/warning.svg',
      width: '2197',
      height: '1757',
      caption: 'warning machines logo',
      inLanguage: 'en-US',
    },
    {
      '@type': 'AboutPage',
      '@id': 'https://warning-machines.com/#webpage',
      url: 'https://warning-machines.com/',
      name: siteTitle,
      datePublished: '2025-06-18T09:15:48+00:00',
      dateModified: '2025-12-09T19:12:23+00:00',
      about: { '@id': 'https://warning-machines.com/#organization' },
      isPartOf: { '@id': 'https://warning-machines.com/#website' },
      primaryImageOfPage: { '@id': 'https://warning-machines.com/wp-content/uploads/2025/06/warning.svg' },
      inLanguage: 'en-US',
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://warning-machines.com'),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: '/images/warning-logo.png',
    shortcut: '/images/warning-logo.png',
    apple: '/images/warning-logo.png',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://warning-machines.com/',
    siteName: 'Warning Machines',
    title: siteTitle,
    description: siteDescription,
    locale: 'en_US',
    images: [
      {
        url: ogImage,
        width: 512,
        height: 512,
        alt: 'warning machines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  verification: {
    google: 'vnuU2uhX1v_Vnp4jwro2Ab6bil7TnIexsLw22gT2eBA',
    other: {
      verification: ['f612c7d25f5690ad41496fcfdbf8d1'],
    },
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="page">
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
        <Script id="structured-data" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(structuredData)}
        </Script>
      </body>
    </html>
  );
}
