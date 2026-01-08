import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

export const dynamic = 'force-static';

const canonicalUrl = 'https://warning-machines.com/services/3d-printing-service/';
const ogImage = '/images/services/3d-printing/image1.png';

export const metadata: Metadata = {
  title: '3D Printing Service | Warning Machines',
  description:
    'At Warning Machines, our professional 3D printing services open up a world of possibilities for rapid prototyping, low-volume production, and customized',
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-video-preview': -1,
    'max-image-preview': 'large',
  },
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    locale: 'en_US',
    type: 'article',
    title: '3D Printing Service | Warning Machines',
    description:
      'At Warning Machines, our professional 3D printing services open up a world of possibilities for rapid prototyping, low-volume production, and customized',
    url: canonicalUrl,
    siteName: 'Warning Machines',
    images: [
      {
        url: ogImage,
        secureUrl: ogImage,
        width: 1472,
        height: 832,
        alt: '3D Printing Service',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Printing Service | Warning Machines',
    description:
      'At Warning Machines, our professional 3D printing services open up a world of possibilities for rapid prototyping, low-volume production, and customized',
    images: [ogImage],
  },
  other: {
    'twitter:label1': 'Time to read',
    'twitter:data1': '1 minute',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${canonicalUrl}#webpage`,
  url: canonicalUrl,
  name: '3D Printing Service | Warning Machines',
  description:
    'At Warning Machines, our professional 3D printing services open up a world of possibilities for rapid prototyping, low-volume production, and customized',
  inLanguage: 'en-US',
  isPartOf: { '@id': 'https://warning-machines.com/#website' },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: ogImage,
    width: '1472',
    height: '832',
    caption: '3D Printing Service',
  },
  dateModified: '2025-08-28T19:32:20+00:00',
};

const technologies = [
  {
    src: '/images/services/3d-printing/image2.png',
    alt: 'Stereolithography (SLA): For smooth, high‑resolution, accurate parts.',
    caption: 'Stereolithography',
  },
  {
    src: '/images/services/3d-printing/image3.png',
    alt: 'Selective Laser Sintering (SLS): Ideal for strong and durable nylon components.',
    caption: 'Selective Laser Sintering',
  },
  {
    src: '/images/services/3d-printing/image4.png',
    alt: 'Fused Filament Fabrication (FFF): Cost‑effective solutions for thermoplastic parts.',
    caption: 'Fused Filament Fabrication',
  }
];

const benefits = [
  {
    title: 'Part Consolidation',
    description: 'Reduce multiple components into one printed part, minimizing assembly and failure points.',
  },
  {
    title: 'Faster Iterations',
    description: 'Quickly test and refine multiple designs without long lead times for tooling.',
  },
  {
    title: 'Design Freedom',
    description: 'Create internal channels, lightweight lattice structures, or complex manifolds optimized for performance.',
  },
  {
    title: 'Scalability',
    description: 'Transition seamlessly from prototyping to CNC machining or injection molding with expert advice.',
  },
];

export default function PrintingServicePage() {
  return (
    <>
      <div className="page printing-service-page">
        <section className="section section--narrow">
          <div className="section__header">
            <h1>3D Printing Service</h1>
          </div>
        </section>

        <section className="section section--narrow">
          <h2>3D Printing Services at Warning Machines</h2>
          <p>
            At <strong>Warning Machines</strong>, our professional 3D printing services open up a world of possibilities for{' '}
            <strong>rapid prototyping, low-volume production, and customized manufacturing solutions</strong>. Using advanced
            additive manufacturing, we build parts layer by layer from your digital files, enabling{' '}
            <strong>complex geometries, lightweight structures, and integrated internal channels</strong> that would be nearly
            impossible or too costly with traditional machining or molding. We can deliver functional prototypes and
            production-ready parts with no tooling <strong>in as little as 24 hours</strong>.
          </p>
          <div className="card card--article" style={{ marginTop: '1.5rem' }}>
            <div className="card__image">
              <Image
                src="/images/services/3d-printing/image1.png"
                alt="3D Printing Services at Warning Machines"
                width={1472}
                height={832}
              />
            </div>
          </div>
        </section>

        <section className="section section--narrow">
          <div className="section__header">
            <h3>Wide Range of 3D Printing Technologies</h3>
          </div>
          <p>
            We offer multiple 3D printing processes to match your{' '}
            <strong>material, strength, tolerance, and surface finish requirements</strong>
          </p>
          <p>
            Our team of engineers will guide you in choosing the best technology and material combination for your project
            based on design intent, durability needs, and production volume.
          </p>
          <div
            className="grid"
            style={{ gap: '1rem', marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
          >
            {technologies.map((tech) => (
              <figure key={tech.caption} className="card card--article" style={{ margin: 0 }}>
                <div className="card__image">
                  <Image src={tech.src} alt={tech.alt} width={400} height={400} />
                </div>
                <figcaption className="card__caption">{tech.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section section--narrow">
          <div className="section__header">
            <h3>Benefits of Industrial 3D Printing</h3>
          </div>
          <div
            className="grid"
            style={{ gap: '1.5rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
          >
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem' }}>{benefit.title}</h4>
                <p style={{ margin: 0, opacity: 0.85 }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section section--narrow">
          <h2>Why Choose Warning Machines for your 3D Printing Project?</h2>
          <ul>
            <li>
              <strong>Fast Turnaround:</strong> Parts delivered within days, not weeks.
            </li>
            <li>
              <strong>Scalable Capacity:</strong> Access to more than 45+ professional-grade 3D printers.
            </li>
            <li>
              <strong>Expert Engineering Support:</strong> From design optimization to final production.
            </li>
            <li>
              <strong>Flexible Orders:</strong> No minimum order quantity—ideal for both prototypes and production runs.
            </li>
          </ul>
          <p>
            Whether you need <strong>a single prototype, small-batch production, or complex end-use parts</strong>, our 3D
            printing services deliver <strong>speed, precision, and design freedom</strong>—helping you move from idea to
            reality faster than ever.
          </p>
        </section>
      </div>

      <Script
        id="json-ld-3d-printing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
    </>
  );
}

