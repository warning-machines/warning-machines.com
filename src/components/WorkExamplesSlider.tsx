"use client";

import { useState } from 'react';
import type { PortfolioProject } from '@/lib/loadPortfolioProjects';
import './WorkExamplesSlider.css';

type Props = {
  projects: PortfolioProject[];
};

export function WorkExamplesSlider({ projects }: Props) {
  const [active, setActive] = useState(0);
  const total = projects.length;

  if (total === 0) return null;

  function prev() {
    setActive((i) => (i - 1 + total) % total);
  }

  function next() {
    setActive((i) => (i + 1) % total);
  }

  const project = projects[active];

  return (
    <section className="work-examples">
      <h2 className="work-examples__title">A few examples of the work</h2>

      <div className="work-slider">
        <div className="work-slider__main">
          <div className="work-slider__image">
            {project.image ? (
              <img key={project.id} src={project.image} alt={project.title} />
            ) : (
              <div className="work-slider__placeholder">
                <span>Photo coming soon</span>
              </div>
            )}
          </div>

          <div className="work-slider__info">
            <h3 className="work-slider__name">{project.title}</h3>
            <p className="work-slider__desc">{project.description}</p>
            <div className="work-slider__tags">
              {project.tags.map((tag) => (
                <span key={tag} className="work-slider__tag">{tag}</span>
              ))}
            </div>

            <div className="work-slider__nav">
              <button className="work-slider__arrow" onClick={prev} aria-label="Previous">‹</button>
              <span className="work-slider__counter">{active + 1}/{total}</span>
              <button className="work-slider__arrow" onClick={next} aria-label="Next">›</button>
            </div>
          </div>
        </div>

        <div className="work-slider__thumbs">
          {projects.map((p, i) => (
            <button
              key={p.id}
              className={`work-slider__thumb${i === active ? ' work-slider__thumb--active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={p.title}
            >
              {p.image ? (
                <img src={p.image} alt={p.title} />
              ) : (
                <div className="work-slider__thumb-placeholder" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
