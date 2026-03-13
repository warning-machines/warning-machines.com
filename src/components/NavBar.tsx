'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { useGoogleAuth } from './auth/useGoogleAuth';

const services = [
  { label: 'Electronics', href: '/services/electronics' },
  { label: 'Industrial Design', href: '/services/cad/experimental' },
  { label: 'Software / Firmware development', href: '/services/firmware' },
  { label: 'Manufacturing', href: '/services/3d-printing' },
];

export function NavBar() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalQuoteItems } = useQuoteCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesTimer = useRef<NodeJS.Timeout | null>(null);

  const { handleGoogleCredential } = useGoogleAuth();

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handler as unknown as EventListener);
    return () => document.removeEventListener('click', handler as unknown as EventListener);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  const closeNav = () => {
    setNavOpen(false);
    setServicesOpen(false);
  };

  const displayName = user?.name || 'Account';

  return (
    <header className={`nav${navOpen ? ' nav--open' : ''}`}>
      <div className="nav__brand">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }} onClick={closeNav}>
          <img src="/images/logos/warning.png" alt="Warning Machines" style={{ width: '70px' }} />
          Warning</Link>
      </div>
      <nav className="nav__links" aria-label="Primary">
        <button
          type="button"
          className="nav__link"
          onClick={() => {
            closeNav();
            window.dispatchEvent(new CustomEvent('replay-intro'));
            router.push('/');
          }}
        >
          Home
        </button>
        <div
          className="nav__item nav__item--has-submenu"
          onMouseEnter={() => {
            if (servicesTimer.current) clearTimeout(servicesTimer.current);
            setServicesOpen(true);
          }}
          onMouseLeave={() => {
            if (servicesTimer.current) clearTimeout(servicesTimer.current);
            servicesTimer.current = setTimeout(() => setServicesOpen(false), 150);
          }}
        >
          <button
            type="button"
            className="nav__link nav__link--trigger"
            aria-haspopup="true"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen(!servicesOpen)}
          >
            Services
            <span className="nav__caret" aria-hidden="true">▼</span>
          </button>
          <div
            className={`nav__submenu ${servicesOpen ? 'is-open' : ''}`}
            role="menu"
            onMouseEnter={() => {
              if (servicesTimer.current) clearTimeout(servicesTimer.current);
              setServicesOpen(true);
            }}
            onMouseLeave={() => {
              if (servicesTimer.current) clearTimeout(servicesTimer.current);
              servicesTimer.current = setTimeout(() => setServicesOpen(false), 150);
            }}
          >
            {services.map((item) => (
              <Link key={item.href} href={item.href} className="nav__submenu-link" role="menuitem" onClick={closeNav}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/products" className="nav__link" onClick={closeNav}>Products</Link>
        <Link href="/about-us" className="nav__link" onClick={closeNav}>About Us</Link>
        <Link className="button button--primary nav__cta--mobile" href="/quote-form" onClick={closeNav}>Book a meeting</Link>
      </nav>
      <div className="nav__actions">
        {authLoading ? null : user ? (
          <div className="nav__user" ref={menuRef}>
            <button className="nav__user-btn nav__user-avatar" onClick={() => setMenuOpen((open) => !open)} aria-haspopup="true" aria-expanded={menuOpen}>
              {displayName?.[0]?.toUpperCase() || 'U'}
            </button>
            {menuOpen ? (
              <div className="nav__dropdown" role="menu">
                <span className="nav__user-name">{displayName}</span>
                <hr style={{width: '100%'}} />
                <button className="nav__dropdown-item" role="menuitem" onClick={logout}>Log out</button>
              </div>
            ) : null}
          </div>
        ) : <span className="nav__google-btn"><GoogleSignInButton size='small' theme='filled_black' onCredential={handleGoogleCredential} text="signin" /></span>}
        <Link href="/cart" className="nav__cart">
          <img src="/images/icons/cart.svg" alt="Cart" style={{width: '33px'}} />
          {(totalItems + totalQuoteItems) > 0 && <span className="nav__cart-badge">{totalItems + totalQuoteItems}</span>}
        </Link>
        <Link className="button button--primary nav__cta--desktop" href="/quote-form">Book a meeting</Link>
        <button
          className="nav__hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
