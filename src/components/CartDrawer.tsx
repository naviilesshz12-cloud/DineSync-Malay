'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, orderType, setOrderType } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={closeCart} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Your Order</h3>
          <button onClick={closeCart} className="close-btn" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Order Type Toggle */}
        <div className="order-type-toggle">
          <button
            className={`toggle-btn ${orderType === 'dine-in' ? 'active' : ''}`}
            onClick={() => setOrderType('dine-in')}
          >
            🍽️ Dine-In
          </button>
          <button
            className={`toggle-btn ${orderType === 'takeaway' ? 'active' : ''}`}
            onClick={() => setOrderType('takeaway')}
          >
            📦 Takeaway
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p>Your cart is empty</p>
              <span>Browse our menu to add items</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">RM{item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="total-price">RM{getTotal().toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary btn-lg checkout-btn" onClick={closeCart}>
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          max-width: 100vw;
          height: 100vh;
          background: var(--color-bg-elevated);
          border-left: 1px solid var(--color-border);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.3s ease;
        }
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .cart-header h3 {
          font-family: var(--font-display);
          font-size: var(--text-xl);
        }
        .close-btn {
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
          padding: var(--space-2);
        }
        .close-btn:hover { color: var(--color-text); }

        .order-type-toggle {
          display: flex;
          gap: var(--space-2);
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .toggle-btn {
          flex: 1;
          padding: var(--space-2) var(--space-4);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .toggle-btn.active {
          border-color: var(--color-primary);
          background: var(--color-primary-glow);
          color: var(--color-primary);
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4) var(--space-6);
        }
        .cart-empty {
          text-align: center;
          padding: var(--space-12) 0;
          color: var(--color-text-muted);
        }
        .cart-empty p {
          margin-top: var(--space-4);
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .cart-empty span {
          font-size: var(--text-sm);
        }

        .cart-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--color-border);
          position: relative;
        }
        .cart-item-img {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        .cart-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-info {
          flex: 1;
        }
        .cart-item-info h4 {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-1);
        }
        .cart-item-price {
          font-size: var(--text-sm);
          color: var(--color-primary);
          font-weight: 600;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }
        .quantity-controls button {
          width: 26px;
          height: 26px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .quantity-controls button:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        .quantity-controls span {
          font-size: var(--text-sm);
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }
        .remove-btn {
          position: absolute;
          top: var(--space-4);
          right: 0;
          color: var(--color-text-muted);
          padding: var(--space-1);
          transition: color var(--transition-fast);
        }
        .remove-btn:hover { color: var(--color-error); }

        .cart-footer {
          padding: var(--space-6);
          border-top: 1px solid var(--color-border);
          background: var(--color-bg-card);
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
          font-size: var(--text-lg);
          font-weight: 600;
        }
        .total-price {
          color: var(--color-primary);
          font-family: var(--font-display);
          font-size: var(--text-2xl);
        }
        .checkout-btn {
          width: 100%;
          text-align: center;
        }

        @media (max-width: 480px) {
          .cart-drawer { width: 100vw; }
        }
      `}</style>
    </>
  );
}
