'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function FloatingCTA() {
  const itemCount = useCartStore((s) => s.items.length);

  return (
    <>
      <div className="floating-cta">
        <Link href="/reservations" className="fab fab-reserve" aria-label="Book a table">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Book</span>
        </Link>
        {itemCount > 0 && (
          <Link href="/checkout" className="fab fab-order" aria-label="Checkout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span>Checkout</span>
          </Link>
        )}
      </div>

      <style jsx>{`
        .floating-cta {
          position: fixed;
          bottom: var(--space-8);
          right: var(--space-8);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          z-index: 90;
        }
        .fab {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-base);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .fab:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: var(--shadow-xl);
        }
        .fab-reserve {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: var(--color-text-inverse);
        }
        .fab-order {
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
          color: #fff;
          animation: fadeInUp 0.3s ease;
        }

        @media (max-width: 768px) {
          .floating-cta {
            bottom: var(--space-4);
            right: var(--space-4);
          }
          .fab span { display: none; }
          .fab {
            width: 48px;
            height: 48px;
            padding: 0;
            justify-content: center;
            border-radius: var(--radius-full);
          }
        }
      `}</style>
    </>
  );
}
