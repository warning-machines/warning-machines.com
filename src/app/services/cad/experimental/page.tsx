/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { loadPortfolioProjects } from '@/lib/loadPortfolioProjects';
import './experimental.css';
import '../cad.css';

export const dynamic = 'force-static';

const process = [
  { num: '01', title: 'Brief & References', desc: 'We define what the product needs to do, who uses it, and how it should look and feel. Reference images, competitor analysis, and rough sketches set the creative direction.' },
  { num: '02', title: 'Concept Modelling', desc: 'A first rough 3D form is built — fast, iterative, focused on shape and proportion. No engineering constraints yet, just the right look.' },
  { num: '03', title: 'Renders & Approval', desc: 'Photorealistic renders from multiple angles, with colour and material variants. You review and approve the design before we move to precision engineering.' },
  { num: '04', title: 'Technical CAD', desc: 'The approved design is rebuilt as a parametric CAD model with real dimensions, tolerances, wall thicknesses, and material properties.' },
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

export default function CADExperimentalPage() {
  const projects = loadPortfolioProjects('industrial-design');

  return (
    <main className="id-page">

      <header className="id-hero">
        <div className="id-hero__bg" style={{ backgroundImage: "url('/images/services/industrial-design/header-background/CAD.png')" }} />
        <div className="id-hero__overlay" />
        <div className="id-hero__text">
          <h1 className="id-hero__title">Industrial Design</h1>
        </div>
      </header>

      <div className="id-grid">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/services/cad/experimental/${encodeURIComponent(project.id)}`}
            className="id-card"
          >
            {project.image
              ? <img src={project.image} alt={project.title} className="id-card__img" />
              : <div className="id-card__placeholder" />
            }
            <div className="id-card__overlay" />
            <div className="id-card__info">
              <span className="id-card__num">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="id-card__title">{project.title}</h2>
              <div className="id-card__tags">
                {project.tags.map(tag => (
                  <span key={tag} className="id-card__tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="id-prose">

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
          className="button button--primary"
          href="/quote-form"
        >
          Start your design project
        </Link>

      </div>

    </main>
  );
}
