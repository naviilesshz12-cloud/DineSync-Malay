'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { restaurantInfo, operatingHours } from '@/lib/data';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="logo-icon">◆</span>
              Dine<span className="gold-accent">Sync</span>
            </Link>
            <p className="footer-description">{restaurantInfo.description.substring(0, 140)}...</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram" className="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link href="/menu">Our Menu</Link></li>
              <li><Link href="/reservations">Reservations</Link></li>
              <li><Link href="/menu">Order Online</Link></li>
            </ul>
          </div>

          {/* Hours */}
          <div className="footer-section">
            <h4 className="footer-heading">Hours</h4>
            <ul className="footer-hours">
              <li><span>Mon–Wed</span><span>{operatingHours.monday.open} – {operatingHours.monday.close}</span></li>
              <li><span>Thu</span><span>{operatingHours.thursday.open} – {operatingHours.thursday.close}</span></li>
              <li><span>Fri–Sat</span><span>{operatingHours.friday.open} – {operatingHours.friday.close}</span></li>
              <li><span>Sunday</span><span>{operatingHours.sunday.open} – {operatingHours.sunday.close}</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{restaurantInfo.address}<br/>{restaurantInfo.city}</span>
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{restaurantInfo.phone}</span>
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>{restaurantInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} DineSync. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--color-bg-card);
          border-top: 1px solid var(--color-border);
          padding: var(--space-16) 0 var(--space-8);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: var(--space-12);
          margin-bottom: var(--space-12);
        }
        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 700;
          margin-bottom: var(--space-4);
        }
        .logo-icon { color: var(--color-primary); font-size: var(--text-sm); }
        .footer-description {
          color: var(--color-text-muted);
          font-size: var(--text-sm);
          line-height: 1.7;
          margin-bottom: var(--space-6);
        }
        .social-links { display: flex; gap: var(--space-3); }
        .social-link {
          width: 36px; height: 36px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .social-link:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: var(--color-primary-glow);
        }
        .footer-heading {
          font-family: var(--font-display);
          font-size: var(--text-base);
          color: var(--color-primary);
          margin-bottom: var(--space-6);
          font-weight: 600;
        }
        .footer-links li { margin-bottom: var(--space-3); }
        .footer-links a {
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          transition: color var(--transition-fast);
        }
        .footer-links a:hover { color: var(--color-primary); }
        .footer-hours li {
          display: flex; justify-content: space-between;
          font-size: var(--text-sm); color: var(--color-text-secondary);
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--color-border);
        }
        .footer-contact li {
          display: flex; gap: var(--space-3); align-items: flex-start;
          font-size: var(--text-sm); color: var(--color-text-secondary);
          margin-bottom: var(--space-4);
        }
        .footer-contact svg { margin-top: 3px; flex-shrink: 0; color: var(--color-primary); }
        .footer-bottom {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: var(--space-8);
          border-top: 1px solid var(--color-border);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .footer-bottom-links { display: flex; gap: var(--space-6); }
        .footer-bottom-links a {
          color: var(--color-text-muted);
          transition: color var(--transition-fast);
        }
        .footer-bottom-links a:hover { color: var(--color-primary); }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
          .footer-bottom {
            flex-direction: column;
            gap: var(--space-4);
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
