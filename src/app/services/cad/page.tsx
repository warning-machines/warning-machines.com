import Link from 'next/link';
import { WorkExamplesSlider } from "@/components/WorkExamplesSlider";
import { loadPortfolioProjects } from "@/lib/loadPortfolioProjects";
import './cad.css';

export const dynamic = 'force-static';

const tools = [
  {
    title: 'Fusion 360',
    body: 'Our primary CAD/CAM tool. We use it for parametric 3D modelling, assemblies, technical drawings and generating CNC toolpaths — all in a single environment.',
    items: ['Parametric & direct modelling', 'Sheet metal & injection mould design', 'CAM toolpath generation', 'Simulation & stress analysis', 'Technical drawings & GD&T'],
  },
  {
    title: 'Blender',
    body: 'Used for organic / artistic shapes, concept renders and any model that benefits from sculpting rather than parametric constraints.',
    items: ['Subdivision & sculpt modelling', 'Photorealistic rendering (Cycles)', 'Animation & motion studies', 'STL/OBJ export for 3D printing', 'Product visualisation'],
  },
];

const capabilities = [
  {
    title: 'CAD — Computer-Aided Design',
    body: 'We create precise 3D models and 2D technical drawings for enclosures, mechanical parts, assemblies and consumer products. Every model is built with manufacturing in mind — tolerances, draft angles and material properties are considered from the first sketch.',
    items: ['Enclosure & housing design', 'Mechanical parts & assemblies', 'Fixtures, jigs & tooling', 'Reverse engineering from photos or sketches', 'Technical drawings with GD&T'],
  },
  {
    title: 'CAM — Computer-Aided Manufacturing',
    body: 'CAM bridges the gap between a 3D model and the machine that cuts it. We generate optimised toolpaths for CNC milling, turning, and routing, and prepare files for 3D printing and laser cutting.',
    items: ['CNC milling & turning toolpaths', '3-axis and multi-axis strategies', 'G-code generation & post-processing', 'Slicer preparation for FDM / SLA / SLS', 'Laser cutting DXF / SVG output'],
  },
  {
    title: 'CNC Machining Design',
    body: 'We design parts specifically for CNC production — selecting the right stock, orientations and operations to minimise cost while meeting tolerances.',
    items: ['Aluminium, steel, brass, PEEK, Delrin', 'Tolerances down to ±0.02 mm', 'Surface finish specifications', 'DFM review before production', 'Low-volume to production runs'],
  },
];

const process = [
  { num: '01', title: 'Brief & Requirements', desc: 'We collect dimensions, material specs, tolerances, and manufacturing method (3D print, CNC, laser cut) before touching any software.' },
  { num: '02', title: '3D Modelling', desc: 'Parametric model built in Fusion 360 or Blender. Iterative design — we send you screenshots/renders at each milestone for feedback.' },
  { num: '03', title: 'Technical Drawing', desc: 'Fully annotated 2D drawings with dimensions, tolerances, surface finishes and material callouts — ready to hand to any machine shop.' },
  { num: '04', title: 'CAM & Toolpaths', desc: 'Toolpaths optimised for your material and machine. We verify with simulation before generating G-code to avoid collisions and waste.' },
  { num: '05', title: 'File Delivery', desc: 'You receive all native files plus universal exchange formats (STEP, STL, DXF) so you\'re never locked to our software.' },
];

const formats = {
  'Input formats we accept': [
    '.step / .stp', '.iges / .igs', '.stl', '.obj', '.fbx',
    '.dwg', '.dxf', '.f3d / .f3z', '.blend', '.sldprt / .sldasm',
    '.3mf', '.svg', 'Sketches / photos',
  ],
  'Output formats we deliver': [
    '.step / .stp', '.stl', '.obj', '.dxf', '.svg',
    '.f3d (Fusion 360)', '.blend (Blender)', '.pdf (drawings)',
    '.nc / .gcode (CNC)', '3MF (print-ready)',
  ],
};

export default function CADPage() {
  const projects = loadPortfolioProjects('cad');

  return (
    <main className="section blog service-page">
      <div className="section__header">
        <div className="section__header-content">
          <h1>CAD / CAM design & manufacturing</h1>
          <p className="section__lede">
            From a napkin sketch to a production-ready file — we model, draw and generate toolpaths for 3D printing, CNC machining and laser cutting.
          </p>
        </div>
        <img className="article__hero" src='/images/services/CAD.jpg' alt='CAD / CAM design' style={{ objectPosition: '50% 40%' }} />
        <div className="gradient"></div>
      </div>

      <article className="article__body">

        {/* What we do */}
        <section className="cad-section">
          <h2 className="cad-section__title">CAD & CAM — what&apos;s the difference?</h2>
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

        {/* Work examples */}
        <WorkExamplesSlider projects={projects} />

        {/* Tools */}
        <section className="cad-section">
          <h2 className="cad-section__title">Tools we use</h2>
          <p className="cad-section__lead">
            We choose the right tool for the job — parametric precision for engineering parts, free-form sculpting for organic shapes.
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
          Start your CAD / CAM project
        </Link>

      </article>
    </main>
  );
}
