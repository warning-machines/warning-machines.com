/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import './footer.css';

const services = [
  { label: 'Electronics', href: '/services/electronics' },
  { label: 'Industrial Design', href: '/services/cad/experimental' },
  { label: 'Firmware', href: '/services/firmware' },
  { label: 'Manufacturing', href: '/services/3d-printing' },
];

const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/warning.machines/', icon: '/images/icons/instagram.svg' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/warning-machines/', icon: '/images/icons/linkedin.svg' },
  { label: 'WhatsApp', href: 'https://wa.me/359889231070', icon: '/images/icons/whatsapp.svg' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@warning.machines.com', icon: '/images/icons/tiktok.svg' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">

        {/* Column 1 — Brand + services */}
        <div className="footer__col footer__col--brand">
          <Link href="/" className="footer__logo">
            <img src="/images/logos/warning.png" alt="Warning Machines" />
            <span>WARNING</span>
          </Link>
          <ul className="footer__services">
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 — Contact */}
        <div className="footer__col">
          <p className="footer__col-title"><Link href="/contact">Contact us</Link></p>
          <ul className="footer__contact">
            <li>
              <a href="mailto:info@warning-machines.com" target="_blank" rel="noreferrer">
                info@warning-machines.com
              </a>
            </li>
            <li>
              <a href="tel:+359889231070" target="_blank" rel="noreferrer">
                +359 889 231 070
              </a>
            </li>
            <li>
              <a href="https://maps.app.goo.gl/pZRP8r5zh7kDi3wj9" target="_blank" rel="noreferrer">
                20-ti April 13, Sofia, Bulgaria
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 — Social */}
        <div className="footer__col">
          <p className="footer__col-title">Stay connected</p>
          <p className="footer__social-sub">Follow us and reach out on any platform.</p>
          <div className="footer__social">
            {social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="footer__social-icon">
                <img src={s.icon} alt={s.label} />
              </a>
            ))}
          </div>
        </div>

      </div>

      <p className="footer__legal">© {new Date().getFullYear()} Warning Machines. All rights reserved.</p>
    </footer>
  );
}
