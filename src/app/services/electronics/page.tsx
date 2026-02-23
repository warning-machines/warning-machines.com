import type { Metadata } from 'next';
import { Steps } from './steps';
import { WorkExamples } from './WorkExamples';
import { loadElectronicsProjects } from './loadProjects';
import '../cad/cad.css';

const process = [
  { num: '01', title: 'Requirements & Specification', desc: 'Define what the circuit needs to do — power budget, interfaces, environment, communication protocols, and any regulatory constraints (CE, FCC, RoHS).' },
  { num: '02', title: 'Schematic Design', desc: 'Translate the specification into a circuit schematic. Component selection, power regulation, signal chains, protection circuits, and connector pinouts are all resolved at this stage.' },
  { num: '03', title: 'PCB Layout', desc: 'Place components and route traces with signal integrity, EMC, and DFM in mind. We define layer stackup, controlled impedances, copper pours, and thermal management before release.' },
  { num: '04', title: 'Design Review & Simulation', desc: 'Run DRC, ERC, and thermal analysis. Critical sub-circuits are simulated in LTspice before the board is sent to fabrication to catch issues early.' },
  { num: '05', title: 'Prototype & Bring-Up', desc: 'Gerbers go to the fab, components are assembled, and the board is brought up incrementally using bench instruments — power supply, oscilloscope, logic analyser.' },
  { num: '06', title: 'Testing & Validation', desc: 'Functional tests against the original specification. We document test results and iterate on any issues before sign-off for production.' },
  { num: '07', title: 'Production Files', desc: 'You receive gerbers, BOM, pick-and-place files, test specification, and schematic PDF — everything your contract manufacturer needs to produce the board at scale.' },
];

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
      <img className="article__hero" src='/images/services/electronics/header-background/electronics.webp' alt='Electronics development for smart devices' />
      <div className="gradient"></div>
    </div>
    <article className="article__body">
      <p className="section__intro">
        PCB design is the process of translating a circuit schematic into a physical board layout. We use industry-standard tools to place components, route traces, and verify signal integrity before sending files to manufacture. Every layer — copper pours, silkscreen, solder mask — is carefully considered to ensure the board is reliable, testable, and cost-effective to produce in both prototype and production quantities.
      </p>
      <Steps />
      <WorkExamples projects={projects} />

      <section className="cad-section">
        <h2 className="cad-section__title">Our process</h2>
        <div className="cad-process">
          {process.map((step) => (
            <div key={step.num} className="cad-process__step">
              <span className="cad-process__num">{step.num}</span>
              <div>
                <h3 className="cad-process__step-title">{step.title}</h3>
                <p className="cad-process__step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  </main>
}
