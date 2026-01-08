import type { Metadata } from 'next';
import { OurProjects } from './projects';
import { Steps } from './steps';

export const dynamic = 'force-static';

const canonicalUrl = 'https://warning-machines.com/electronics/';

export const metadata: Metadata = {
  title: 'Electronics development for smart devices | Warning Machines',
  description: 'Electronics development for smart devices from Warning Machines. Custom electronics solutions for your products.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    locale: 'en_US',
    type: 'article',
    title: 'Electronics development for smart devices | Warning Machines',
    description: 'Electronics development for smart devices from Warning Machines. Custom electronics solutions for your products.',
    url: canonicalUrl,
    siteName: 'Warning Machines',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electronics development for smart devices | Warning Machines',
    description: 'Electronics development for smart devices from Warning Machines. Custom electronics solutions for your products.',
  },
};

export default function ElectronicsPage() {
  return <main className="section blog service-page">
    <div className="section__header">
      <div className="section__header-content">
        <h1>Electronics development for smart devices</h1>
        <p className="section__lede">
          With many projects under our belt we design electronics for any application - healthcare, robotics, machinery, toys, etc.
        </p>
      </div>
      <img className="article__hero" src='/images/services/electronics/electronics.webp' alt='Electronics development for smart devices' />
      <div className="gradient"></div>
    </div>
    <article className="article__body">
      <Steps />
      <OurProjects />
    </article>
  </main>
}

