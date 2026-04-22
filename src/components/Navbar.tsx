'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, getItemCount } = useCartStore();
  const { isAdmin, setAdmin, logout } = useAdminStore();
  const router = useRouter();
  const [itemCount, setItemCount] = useState(0);

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      router.push('/admin');
      return;
    }

    const pin = prompt('Enter Management Password (PIN):');
    if (pin === '2115') {
      setAdmin(true);
      router.push('/admin');
    } else if (pin !== null) {
      alert('Access Denied: Incorrect Password');
    }
  };

  useEffect(() => {
    setItemCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      setItemCount(state.getItemCount());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner container">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">Dine<span className="gold-accent">Sync</span></span>
          </Link>

          <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
            <Link href="/menu" onClick={() => setMobileOpen(false)}>Menu</Link>
            <Link href="/reservations" onClick={() => setMobileOpen(false)}>Reservations</Link>
            <Link href="/track" onClick={() => setMobileOpen(false)}>Track Order</Link>
            <Link href="/admin" onClick={handleAdminClick} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              {isAdmin ? '🛡️ Admin Center' : 'Admin Login'}
            </Link>
            {isAdmin && <button onClick={() => { logout(); router.push('/'); }} className="btn-text" style={{ fontSize: 'var(--text-xs)' }}>Logout</button>}
          </div>

          <div className="navbar-actions">
            <button className="cart-btn" onClick={toggleCart} aria-label="Open cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileOpen ? 'active' : ''}`}>
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 0;
          transition: all var(--transition-base);
          background: transparent;
        }
        .navbar-scrolled {
          background: rgba(13, 13, 13, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 700;
          letter-spacing: 0.5px;
          z-index: 1001;
        }
        .logo-icon {
          color: var(--color-primary);
          font-size: var(--text-sm);
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: var(--space-8);
        }
        .navbar-links a {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .navbar-links a:hover {
          color: var(--color-primary);
        }
        .nav-cta {
          color: var(--color-text-inverse) !important;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          z-index: 1001;
        }
        .cart-btn {
          position: relative;
          color: var(--color-text);
          transition: color var(--transition-fast);
          padding: var(--space-2);
        }
        .cart-btn:hover { color: var(--color-primary); }
        .cart-badge {
          position: absolute;
          top: -2px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: var(--color-accent);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mobile-toggle {
          display: none;
          padding: var(--space-2);
        }
        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 22px;
        }
        .hamburger span {
          display: block;
          height: 2px;
          background: var(--color-text);
          border-radius: 2px;
          transition: all var(--transition-base);
        }
        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        @media (max-width: 768px) {
          .mobile-toggle { display: block; }
          .navbar-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: var(--color-bg-elevated);
            flex-direction: column;
            align-items: flex-start;
            padding: calc(var(--nav-height) + var(--space-8)) var(--space-8) var(--space-8);
            gap: var(--space-6);
            transition: right var(--transition-base);
            z-index: 1000;
            border-left: 1px solid var(--color-border);
          }
          .navbar-links.open { right: 0; }
          .navbar-links a {
            font-size: var(--text-base);
            width: 100%;
            padding: var(--space-3) 0;
            border-bottom: 1px solid var(--color-border);
          }
        }
      `}</style>
    </>
  );
}
