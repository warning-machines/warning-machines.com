/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  loadPortfolioProjectIds,
  loadPortfolioProjectDetail,
} from '@/lib/loadPortfolioProjects';
import './project.css';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return loadPortfolioProjectIds('industrial-design').map((id) => ({
    projectId: id,
  }));
}

type Props = {
  params: Promise<{ projectId: string }>;
};

type ImageBlock =
  | { type: 'full'; src: string }
  | { type: 'pair'; srcs: [string, string] }
  | { type: 'asym'; tall: string; stack: string[]; reverse: boolean }
  | { type: 'single'; src: string };

function groupImages(images: string[]): ImageBlock[] {
  const blocks: ImageBlock[] = [];
  let i = 0;
  let asymCount = 0;

  while (i < images.length) {
    const remaining = images.length - i;

    if (remaining >= 3 && blocks.length % 3 === 2) {
      // Every 3rd block: asymmetric (1 tall + 2 stacked)
      blocks.push({
        type: 'asym',
        tall: images[i],
        stack: [images[i + 1], images[i + 2]],
        reverse: asymCount % 2 === 1,
      });
      asymCount++;
      i += 3;
    } else if (remaining >= 2) {
      // Pair
      blocks.push({ type: 'pair', srcs: [images[i], images[i + 1]] });
      i += 2;
    } else if (remaining === 1) {
      // Full-width single
      blocks.push({ type: 'full', src: images[i] });
      i++;
    } else {
      break;
    }
  }

  return blocks;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const decodedId = decodeURIComponent(projectId);

  const project = loadPortfolioProjectDetail('industrial-design', decodedId);
  if (!project) notFound();

  const [heroImage, ...restImages] = project.images;
  const galleryBlocks = groupImages(restImages);

  return (
    <main className="proj-page">

      {/* Nav */}
      <nav className="proj-nav">
        <Link href="/services/cad/experimental" className="proj-nav__back">
          ← Industrial Design
        </Link>
      </nav>

      {/* Intro: title+meta+tags left, description right */}
      <div className="proj-intro">

        <div className="proj-intro__row">
          <div className="proj-intro__left">
            <h1 className="proj-title">{project.title}</h1>

            <div className="proj-meta">
              {project.client && (
                <div className="proj-meta-row">
                  <span className="proj-meta-label">Client</span>
                  <span className="proj-meta-value">{project.client}</span>
                </div>
              )}
              <div className="proj-meta-row">
                <span className="proj-meta-label">Scope</span>
                <span className="proj-meta-value">Industrial Design</span>
              </div>
              {project.year && (
                <div className="proj-meta-row">
                  <span className="proj-meta-label">Year</span>
                  <span className="proj-meta-value">{project.year}</span>
                </div>
              )}
            </div>

            {project.tags.length > 0 && (
              <div className="proj-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="proj-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="proj-intro__right">
            {project.description
              ? <p className="proj-desc">{project.description}</p>
              : <p className="proj-desc--empty">No description added yet.</p>
            }
          </div>
        </div>

      </div>

      {/* Images */}
      <div className="proj-images">

        {/* Hero */}
        {heroImage && (
          <div className="proj-hero-wrap">
            <img src={heroImage} alt={project.title} className="proj-img" />
          </div>
        )}

        {/* Gallery blocks */}
        {galleryBlocks.map((block, i) => {
          if (block.type === 'full' || block.type === 'single') {
            return (
              <div key={i} className="proj-img-full">
                <img src={block.src} alt={`${project.title} ${i + 2}`} className="proj-img" />
              </div>
            );
          }

          if (block.type === 'pair') {
            return (
              <div key={i} className="proj-img-pair">
                {block.srcs.map((src, j) => (
                  <div key={src} className="proj-img-pair__item">
                    <img src={src} alt={`${project.title} ${i + j + 2}`} className="proj-img" />
                  </div>
                ))}
              </div>
            );
          }

          if (block.type === 'asym') {
            return (
              <div key={i} className={`proj-img-asym${block.reverse ? ' proj-img-asym--reverse' : ''}`}>
                <div className="proj-img-asym__tall">
                  <img src={block.tall} alt={`${project.title} ${i + 2}`} className="proj-img" />
                </div>
                <div className="proj-img-asym__stack">
                  {block.stack.map((src, j) => (
                    <div key={src} className="proj-img-asym__stack-item">
                      <img src={src} alt={`${project.title} ${i + j + 3}`} className="proj-img" />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}

      </div>

      {/* CTA */}
      <div className="proj-cta">
        <p className="proj-cta__label">Like what you see?</p>
        <Link href="/quote-form" className="button button--primary">
          Start your design project
        </Link>
      </div>

    </main>
  );
}
