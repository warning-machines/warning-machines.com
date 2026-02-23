import Link from 'next/link';
import { WorkExamplesSlider } from "@/components/WorkExamplesSlider";
import { loadPortfolioProjects } from "@/lib/loadPortfolioProjects";
import './cad.css';

export const dynamic = 'force-static';

const tools = [
  {
    title: 'Blender',
    body: 'Our concept and visualisation tool. We use Blender for the design phase — organic shapes, surface aesthetics, photorealistic renders, and early prototypes before committing to engineering dimensions.',
    items: ['Organic & subdivision modelling', 'Photorealistic rendering (Cycles)', 'Colour & material variant studies', 'Animation & product turntables', 'STL/OBJ export for early 3D print proofs'],
  },
  {
    title: 'Autodesk Fusion 360',
    body: 'Our precision engineering tool. Once the design is approved in Blender, we rebuild it in Autodesk Fusion 360 with exact dimensions, tolerances, and manufacturing constraints.',
    items: ['Parametric & direct modelling', 'Technical drawings with GD&T', 'Assembly design & BOM', 'CAM toolpath generation', 'Simulation & stress analysis'],
  },
];


const process = [
  { num: '01', title: 'Brief & References', desc: 'We define what the product needs to do, who uses it, and how it should look and feel. Reference images, competitor analysis, and rough sketches set the creative direction.' },
  { num: '02', title: 'Concept Modelling', desc: 'A first rough 3D form is built in Blender — fast, iterative, focused on shape and proportion. No engineering constraints yet, just the right look.' },
  { num: '03', title: 'Renders & Approval', desc: 'Photorealistic renders from multiple angles, with colour and material variants. You review and approve the design before we move to precision engineering.' },
  { num: '04', title: 'Technical CAD', desc: 'The approved Blender design is rebuilt as a parametric CAD model in Autodesk Fusion 360 with real dimensions, tolerances, wall thicknesses, and material properties.' },
  { num: '05', title: 'Technical Drawings', desc: 'Fully annotated 2D drawings with dimensions, tolerances, surface finishes and material callouts — ready to hand to any machine shop or manufacturer worldwide.' },
  { num: '06', title: 'File Delivery', desc: 'You receive all native files plus universal formats (STEP, STL, DXF, PDF). You own everything — no vendor lock-in.' },
];

const formats = {
  'Input formats we accept': [
    '.step / .stp', '.iges / .igs', '.stl', '.obj', '.fbx',
    '.dwg', '.dxf', '.f3d / .f3z', '.blend', '.sldprt / .sldasm',
    '.3mf', '.svg', 'Sketches / photos',
  ],
  'Output formats we deliver': [
    '.step / .stp', '.stl', '.obj', '.dxf', '.svg',
    '.f3d (Autodesk Fusion 360)', '.blend (Blender)', '.pdf (drawings)',
    '.nc / .gcode (CNC)', '3MF (print-ready)',
  ],
};

export default function CADPage() {
  const projects = loadPortfolioProjects('cad');

  return (
    <main className="section blog service-page">
      <div className="section__header">
        <div className="section__header-content">
          <h1>Industrial Design</h1>
          <p className="section__lede">
            From your first idea to a production-ready file — we take products through concept, 3D visualisation in Blender, and precision CAD engineering in Autodesk Fusion 360.
          </p>
        </div>
        <img className="article__hero" src='/images/services/industrial-design/header-background/CAD.png' alt='CAD / CAM design' style={{ objectPosition: '50% 40%' }} />
        <div className="gradient"></div>
      </div>

      <article className="article__body">

        {/* What we do */}
        <section className="cad-section">
          <p className="cad-section__lead">
            Industrial design bridges the gap between an idea and a manufacturable product. We start with concepts and visual references, move into 3D modelling and rendering in Blender to nail the look and feel, then rebuild the approved design as a precise parametric model in Autodesk Fusion 360 — complete with tolerances, technical drawings, and manufacturing-ready files. Whether you need a product for injection moulding, CNC machining, or 3D printing, we take it all the way from sketch to production.
          </p>
        </section>

        {/* Work examples */}
        <WorkExamplesSlider projects={projects} />

        {/* Tools */}
        <section className="cad-section">
          <h2 className="cad-section__title">Tools we use</h2>
          <p className="cad-section__lead">
            Two tools, two phases — Blender for design and aesthetics, Autodesk Fusion 360 for precision and manufacturing.
          </p>
          <div className="cad-cards">
            {tools.map((tool) => (
              <div key={tool.title} className="cad-card">
                <h3 className="cad-card__title">{tool.title}</h3>
                <p className="cad-card__body">{tool.body}</p>
                <ul className="cad-card__list">
                  {tool.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
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

        {/* File formats */}
        <section className="cad-section">
          <h2 className="cad-section__title">File formats</h2>
          <p className="cad-section__lead">
            We work with all major CAD exchange formats. Send us what you have — even a photo or sketch — and we&apos;ll handle the rest.
          </p>
          <div className="cad-formats">
            {Object.entries(formats).map(([group, tags]) => (
              <div key={group} className="cad-format-group">
                <h3 className="cad-format-group__title">{group}</h3>
                <div className="cad-format-tags">
                  {tags.map((tag) => (
                    <span key={tag} className="cad-format-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Link
          style={{ display: 'inline-block', margin: '48px 0 16px' }}
          className="button button--primary"
          href="/quote-form"
        >
          Start your design project
        </Link>

      </article>
    </main>
  );
}
