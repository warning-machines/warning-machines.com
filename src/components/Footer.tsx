/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="row">
        <div className="footer__brand">
          <img src="/images/logos/warning.png" alt="Warning Machines" />
          <p>
            WARNING MACHINES is prototyping company specializing in electronics, firmware and CAD.
          </p>
        </div>
        <div className="footer__links">
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/quote-form">Book a meeting</Link>
        </div>
        <div className="footer__contact">
          <Link target="_blank" href="mailto:info@warning-machines.com">
            <img src="/images/icons/email.svg" alt="Email" />
            info@warning-machines.com
          </Link>
          <Link target="_blank" href="tel:+359889231070">
            <img src="/images/icons/phone.svg" alt="Phone" />
            +359 889 231 070
          </Link>
          <Link target="_blank" href="https://maps.app.goo.gl/pZRP8r5zh7kDi3wj9">
            <img src="/images/icons/address.svg" alt="Map" />
            20-ti April 13 Sofia Bulgaria
          </Link>
        </div>
        <div className="footer__social">
          <a
            href="https://www.instagram.com/warning.machines/" target="_blank">
            <img src="/images/icons/instagram.svg" alt="Instagram" />
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/warning-machines/" target="_blank">
            <img src="/images/icons/linkedin.svg" alt="LinkedIn" />
            LinkedIn
            </a>
          <a
            href="https://wa.me/359889231070" target="_blank">
            <img src="/images/icons/whatsapp.svg" alt="WhatsApp" />
            WhatsApp
            </a>
          <a
            href="https://www.tiktok.com/@warning.machines.com" target="_blank">
            <img src="/images/icons/tiktok.svg" alt="TikTok" />
            TikTok
          </a>

        </div>
        
      </div>
      <p className="footer__legal">© {new Date().getFullYear()} Warning Machines. All rights reserved.</p>
    </footer>
  );
}

