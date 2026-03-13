import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';
import './about.css';
import { FallbackImg } from './FallbackImg';
import { loadTeamMembers } from '@/lib/loadTeamMembers';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

function loadImages(folder: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'about', folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => `/images/about/${folder}/${f}`);
}

export const dynamic = 'force-static';

const canonicalUrl = 'https://warning-machines.com/about-us/';
const ogImage = 'https://warning-machines.com/wp-content/uploads/2025/06/Messenger_creation_c90fcfae-aed9-4134-843a-be4dd3fbc961-300x256.jpeg';

export const metadata: Metadata = {
  title: 'About Warning Machines | Warning Machines',
  description:
    'WARNING MACHINES is an engineer-run prototyping and low-volume manufacturing studio. We turn napkin sketches and CAD files into fully functional,',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-video-preview': -1, 'max-image-preview': 'large' } },
  alternates: { canonical: canonicalUrl },
  openGraph: {
    locale: 'en_US', type: 'article',
    title: 'About Warning Machines | Warning Machines',
    description: 'WARNING MACHINES is an engineer-run prototyping and low-volume manufacturing studio.',
    url: canonicalUrl, siteName: 'Warning Machines',
    images: [{ url: ogImage, secureUrl: ogImage, alt: 'about Warning Machines' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Warning Machines | Warning Machines',
    description: 'WARNING MACHINES is an engineer-run prototyping and low-volume manufacturing studio.',
    images: [ogImage],
  },
};

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'AboutPage',
  '@id': `${canonicalUrl}#webpage`, url: canonicalUrl,
  name: 'About Warning Machines | Warning Machines',
  description: 'WARNING MACHINES is an engineer-run prototyping and low-volume manufacturing studio.',
  inLanguage: 'en-US',
  isPartOf: { '@id': 'https://warning-machines.com/#website' },
  primaryImageOfPage: { '@type': 'ImageObject', url: ogImage, caption: 'about Warning Machines' },
  dateModified: '2025-08-27T10:45:24+00:00',
};


const OFFICE_CLASSES = [
  'about-office__cell--wide',
  'about-office__cell--tall',
  'about-office__cell--med',
  'about-office__cell--med',
  'about-office__cell--small',
  'about-office__cell--small',
  'about-office__cell--small',
];

export default function AboutUsPage() {
  const team = loadTeamMembers();
  const officePhotos = loadImages('office');
  const events = loadImages('events');

  return (
    <>
      <div className="about-page">

        {/* ── Hero ── */}
        <section className="about-hero">
          <div className="about-hero__bg" />
          <div className="about-hero__overlay" />
          <div className="about-hero__content">
            <p className="about-hero__eyebrow">Sofia · Bulgaria · Est. 2022</p>
            <h1 className="about-hero__title">Engineer-run.<br />Prototype-obsessed.</h1>
            <p className="about-hero__sub">
              We build the hardware that turns ideas into real products —
              electronics, firmware, industrial design, and manufacturing, all under one roof.
            </p>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="about-stats">
          <div className="about-stat">
            <span className="about-stat__number">30+</span>
            <span className="about-stat__label">Projects delivered</span>
          </div>
          <div className="about-stat">
            <span className="about-stat__number">24h</span>
            <span className="about-stat__label">Quote turnaround</span>
          </div>
          <div className="about-stat">
            <span className="about-stat__number">10+</span>
            <span className="about-stat__label">Countries served</span>
          </div>
          <div className="about-stat">
            <span className="about-stat__number">4</span>
            <span className="about-stat__label">Disciplines in-house</span>
          </div>
        </div>

        {/* ── Story ── */}
        <div className="about-story">
          <div className="about-story__text">
            <p className="about-section-label">Our Story</p>
            <h2 className="about-story__title">Built by engineers<br />tired of slow suppliers</h2>
            <p className="about-story__body">
              WARNING MACHINES was founded by a team of mechanical and embedded-systems engineers
              who watched too many good ideas die in supplier backlogs.
            </p>
            <p className="about-story__body">
              We built a studio where every discipline lives together — CAD, electronics, firmware,
              and manufacturing — so nothing gets lost in translation between teams. One conversation,
              one workflow, one deadline.
            </p>
            <p className="about-story__body">
              Boot-strapped, equipment-rich, and obsessively data-driven. We invest in machines
              and people, not middle layers.
            </p>
          </div>
          <div className="about-story__img-wrap">
            <FallbackImg
              src="/images/about/story/IMG_20251226_155604.jpg"
              alt="Warning Machines studio"
              className="about-story__img"
              placeholderLabel="Studio photo coming soon"
            />
          </div>
        </div>

        {/* ── Team ── */}
        <section className="about-team">
          <div className="about-section-header">
            <p className="about-section-label">The People</p>
            <h2 className="about-section-title">Meet the team</h2>
          </div>
          <div className="about-team__grid">
            {team.map((member, i) => (
              <div key={i} className="about-team__card">
                <FallbackImg src={member.image ?? ''} alt={member.name} placeholderLabel="Team photo coming soon" />
                <div className="about-team__info">
                  <p className="about-team__name">{member.name}</p>
                  <p className="about-team__role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Office ── */}
        <section className="about-office">
          <div className="about-section-header">
            <p className="about-section-label">The Studio</p>
            <h2 className="about-section-title">Where we work</h2>
          </div>
          <div className="about-office__grid">
            {officePhotos.map((file, i) => (
              <div key={i} className={`about-office__cell ${OFFICE_CLASSES[i % OFFICE_CLASSES.length]}`}>
                <FallbackImg src={file} alt={`Office ${i + 1}`} placeholderLabel="Office photo coming soon" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Events ── */}
        <section className="about-events">
          <div className="about-section-header">
            <p className="about-section-label">Out in the world</p>
            <h2 className="about-section-title">Events &amp; meetups</h2>
          </div>
          <div className="about-events__strip">
            {events.map((file, i) => (
              <div key={i} className="about-events__item">
                <FallbackImg src={file} alt={`Event ${i + 1}`} placeholderLabel="Event photo coming soon" />
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-cta">
          <h2 className="about-cta__title">Let&apos;s build something.</h2>
          <p className="about-cta__sub">Send us your files and we&apos;ll get back within 24 hours.</p>
          <Link href="/quote-form" className="button button--primary">Book a meeting</Link>
        </section>

      </div>

      <Script
        id="json-ld-about-us"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
    </>
  );
}
