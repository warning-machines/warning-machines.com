import type { Metadata } from 'next';

export const dynamic = 'force-static';

const canonicalUrl = 'https://warning-machines.com/pcb-and-firmware/';

export const metadata: Metadata = {
  title: 'PCB and Firmware | Warning Machines',
  description: 'PCB design and firmware development services from Warning Machines. Custom electronics solutions for your products.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    locale: 'en_US',
    type: 'article',
    title: 'PCB and Firmware | Warning Machines',
    description: 'PCB design and firmware development services from Warning Machines. Custom electronics solutions for your products.',
    url: canonicalUrl,
    siteName: 'Warning Machines',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PCB and Firmware | Warning Machines',
    description: 'PCB design and firmware development services from Warning Machines. Custom electronics solutions for your products.',
  },
};

export default function PCBAndFirmwarePage() {
  return (
    <div className="page">
      <section className="section section--narrow">
        <div className="section__header">
          <h1>PCB and Firmware</h1>
        </div>
      </section>
    </div>
  );
}

