import type { Hero as HeroType } from '@/types';
import { CircuitAnimation } from '@/components/CircuitAnimation';

type HeroProps = {
  hero: HeroType;
};

const reviews = [
  {
    name: 'Clutch',
    score: '4.9',
    stars: 5,
    color: '#ef4444',
  },
  {
    name: 'Upwork',
    score: '5.0',
    stars: 5,
    color: '#14a800',
  },
  {
    name: 'GoodFirms',
    score: '5.0',
    stars: 5,
    color: '#2196f3',
  },
];

function Stars({ count, color }: { count: number; color: string }) {
  return (
    <span className="hero__stars">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export function Hero({ hero }: HeroProps) {
  return (
    <section className="hero hero--full" id="top">
      <div className="hero__layout">
        <div className="hero__left">
          <h1>
            From concept to <span>reality</span>
          </h1>
          <p className="hero__sub">{hero.subheadline}</p>
          <p className="hero__desc">
            Full product development — hardware, firmware,<br />
            industrial, mechanical, software for Linux<br />
            and Mobile apps
          </p>
          <div className="hero__reviews">
            {reviews.map((r) => (
              <div key={r.name} className="hero__review-item">
                <span className="hero__review-name">{r.name}</span>
                <div className="hero__review-row">
                  <span className="hero__review-score">{r.score}</span>
                  <Stars count={r.stars} color={r.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__right">
          <CircuitAnimation />
        </div>
      </div>
    </section>
  );
}
