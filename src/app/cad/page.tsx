import type { Metadata } from 'next';

export const dynamic = 'force-static';

const canonicalUrl = 'https://warning-machines.com/hardware-design/';

export const metadata: Metadata = {
  title: 'Hardware Design | Warning Machines',
  description: 'Professional hardware design services from Warning Machines. From concept to production-ready designs.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    locale: 'en_US',
    type: 'article',
    title: 'Hardware Design | Warning Machines',
    description: 'Professional hardware design services from Warning Machines. From concept to production-ready designs.',
    url: canonicalUrl,
    siteName: 'Warning Machines',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hardware Design | Warning Machines',
    description: 'Professional hardware design services from Warning Machines. From concept to production-ready designs.',
  },
};

export default function HardwareDesignPage() {
  return (
    <div className="page">
      <section className="section section--narrow">
        <div className="section__header">
          <h1>Hardware Design</h1>
        </div>
      </section>
    </div>
  );
}

