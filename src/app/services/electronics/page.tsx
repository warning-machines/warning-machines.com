import type { Metadata } from 'next';
import { Steps } from './steps';
import { WorkExamples } from './WorkExamples';
import { loadElectronicsProjects } from './loadProjects';

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
  const projects = loadElectronicsProjects();

  return <main className="section blog service-page">
    <div className="section__header">
      <div className="section__header-content">
        <h1>Electronics development for smart devices</h1>
        <p className="section__lede">
          Create your hardware with our electronics development services. We design PCBs for any application.
        </p>
      </div>
      <img className="article__hero" src='/images/services/electronics/electronics.webp' alt='Electronics development for smart devices' />
      <div className="gradient"></div>
    </div>
    <article className="article__body">
      <p className="section__intro">
        PCB design is the process of translating a circuit schematic into a physical board layout. We use industry-standard tools to place components, route traces, and verify signal integrity before sending files to manufacture. Every layer — copper pours, silkscreen, solder mask — is carefully considered to ensure the board is reliable, testable, and cost-effective to produce in both prototype and production quantities.
      </p>
      <Steps />
      <WorkExamples projects={projects} />
    </article>
  </main>
}
