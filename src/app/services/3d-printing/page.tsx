import Link from 'next/link';
import { WorkExamplesSlider } from '@/components/WorkExamplesSlider';
import { loadPortfolioProjects } from '@/lib/loadPortfolioProjects';
import '../cad/cad.css';

const capabilities = [
  {
    title: '3D Printing',
    body: 'FDM and resin printing for rapid prototypes, functional parts, and low-volume production. We print in PLA, PETG, ASA, TPU, and resin.',
    items: ['Complex geometries with no tooling cost', 'Functional prototypes in 24–48 h', 'PLA · PETG · ASA · TPU · Resin', 'Layer heights from 0.1 mm (Fine) to 0.3 mm (Draft)', 'Up to 300 × 300 × 400 mm build volume'],
  },
  {
    title: '3-Axis CNC Machining',
    body: 'Precision subtractive machining for metal and plastic parts. Upload a STEP file and we quote directly from the model.',
    items: ['Materials: Aluminium · Stainless Steel · Steel Alloy · Copper Alloy · Plastic', 'Tolerance: ISO 2768 medium · ±0.10 mm · ±0.05 mm', 'Surface roughness: Ra3.2 · Ra1.6', 'Surface finish options available', 'Threads & sub-assembly on request'],
  },
  {
    title: 'Laser Cutting — Sheet Metal',
    body: 'Fast and accurate cutting of flat sheet metal and non-metal sheet materials. Ideal for brackets, panels, enclosures, and structural parts.',
    items: ['Mild Steel · Stainless Steel · Aluminium', 'Acrylic · Brass', 'Sheet thickness 1 – 10 mm', 'DXF, SVG, or STEP files accepted', 'Clean edges, tight tolerances on cut profiles'],
  },
  {
    title: 'Welding',
    body: 'MIG and TIG welding for steel and aluminium assemblies. We weld cut and formed parts into finished weldments ready for surface treatment.',
    items: ['MIG welding (steel, structural)', 'TIG welding (aluminium, stainless)', 'Weld inspections and grinding', 'Post-weld heat treatment on request', 'Assembly welding from flat-pack parts'],
  },
  {
    title: 'Sheet Metal Bending',
    body: 'Press-brake bending for accurate formed sheet metal parts. We work from flat DXF patterns or finished STEP models with bend allowance applied.',
    items: ['Bend radii from 0.5 × material thickness', 'Steel, aluminium, stainless steel', 'Complex multi-bend profiles', 'Works with laser-cut blanks', 'Flat-pattern DXF or STEP accepted'],
  },
  {
    title: 'Lathe Work',
    body: 'CNC turning for round and symmetric parts — shafts, bushings, fittings, and custom fasteners in a range of metals and plastics.',
    items: ['CNC turning up to Ø150 mm', 'Steel, aluminium, brass, stainless', 'Threading (metric & imperial)', 'Knurling, grooving, boring', 'Combined turning + milling (live tooling)'],
  },
];

export default function ManufacturingPage() {
  const projects = loadPortfolioProjects('manufacturing');

  return (
    <main className="section blog service-page">
      <div className="section__header">
        <div className="section__header-content">
          <h1>Manufacturing</h1>
          <p className="section__lede">
            From prototypes to production runs — 3D printing, CNC machining, laser cutting, welding, and sheet metal work, all under one roof.
          </p>
        </div>
        <img
          className="article__hero"
          src="/images/services/3d-printing/header-background/image1.png"
          alt="Manufacturing services"
          style={{ objectPosition: '50% 40%' }}
        />
        <div className="gradient"></div>
      </div>

      <article className="article__body">

        <p className="section__intro">
          We take your design files and turn them into real parts. Whether you need a single prototype or a short production run, we cover the full range of manufacturing processes in-house — from 3D printing and CNC machining to laser cutting, welding, bending, and lathe work.
        </p>

        {/* Work examples */}
        <WorkExamplesSlider projects={projects} />

        {/* Capabilities */}
        <section className="cad-section">
          <h2 className="cad-section__title">Services:</h2>
          <p className="cad-section__lead">
            Six manufacturing processes, one team. Send us your files and we handle the rest.
          </p>
          <div className="cad-cards">
            {capabilities.map((cap) => (
              <div key={cap.title} className="cad-card">
                <h3 className="cad-card__title">{cap.title}</h3>
                <p className="cad-card__body">{cap.body}</p>
                <ul className="cad-card__list">
                  {cap.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <Link
          style={{ display: 'inline-block', margin: '48px 0 16px' }}
          className="button button--primary"
          href="/quote-form"
        >
          Book a consultation
        </Link>

      </article>
    </main>
  );
}
