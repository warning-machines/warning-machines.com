import type { Metadata } from 'next';
import Link from 'next/link';
import './contact.css';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Warning Machines',
  description: 'Get in touch with the Warning Machines team. We build electronics, industrial design, firmware, and manufacturing solutions.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: 'https://warning-machines.com/contact',
    siteName: 'Warning Machines',
    title: 'Contact Us | Warning Machines',
    description: 'Get in touch with the Warning Machines team.',
  },
};

const contactCards = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'info@warning-machines.com',
    href: 'mailto:info@warning-machines.com',
  },
  {
    icon: '📞',
    label: 'Phone / WhatsApp',
    value: '+359 889 231 070',
    href: 'https://wa.me/359889231070',
  },
  {
    icon: '📍',
    label: 'Office',
    value: '20-ti April 13, Sofia, Bulgaria',
    href: 'https://maps.app.goo.gl/pZRP8r5zh7kDi3wj9',
  },
];

const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/warning.machines/', icon: '/images/icons/instagram.svg' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/warning-machines/', icon: '/images/icons/linkedin.svg' },
  { label: 'WhatsApp', href: 'https://wa.me/359889231070', icon: '/images/icons/whatsapp.svg' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@warning.machines.com', icon: '/images/icons/tiktok.svg' },
];

export default function ContactPage() {
  return (
    <main className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero__bg" aria-hidden="true" />
        <h1 className="contact-hero__title">Get in touch</h1>
        <p className="contact-hero__sub">
          Have a project in mind? A question? Or just want to say hello?
          We read every message.
        </p>
      </section>

      {/* Body: info + form */}
      <div className="contact-body">

        {/* Left — contact info */}
        <div className="contact-info">
          <p className="contact-info__title">Reach us directly</p>
          <div className="contact-info__cards">
            {contactCards.map((card) => (
              <a key={card.label} href={card.href} className="contact-card" target="_blank" rel="noreferrer">
                <div className="contact-card__icon">{card.icon}</div>
                <div className="contact-card__text">
                  <span className="contact-card__label">{card.label}</span>
                  <span className="contact-card__value">{card.value}</span>
                </div>
              </a>
            ))}
          </div>

          <p className="contact-social__title">Follow us</p>
          <div className="contact-social__links">
            {social.map((s) => (
              <a key={s.label} href={s.href} className="contact-social__link" target="_blank" rel="noreferrer" aria-label={s.label}>
                <img src={s.icon} alt={s.label} />
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="contact-form-panel">
          <h2 className="contact-form-panel__title">Send us a message</h2>
          <p className="contact-form-panel__sub">
            We reply within 24 hours. For project quotes,{' '}
            <Link href="/quote-form" style={{ color: '#ffc107' }}>book a meeting</Link> instead.
          </p>
          <ContactForm />
        </div>

      </div>
    </main>
  );
}
