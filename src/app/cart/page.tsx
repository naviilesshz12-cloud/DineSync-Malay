'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import AddToCart from '@/components/AddToCart';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, orderType, setOrderType, specialInstructions, setSpecialInstructions } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const total = getTotal();

  return (
    <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-8)' }}>
          Your <span style={{ color: 'var(--color-primary)' }}>Dining Cart</span>
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🍽️</div>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Your cart is empty</h2>
            <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-8)', alignItems: 'start' }}>
            {/* Items List */}
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: 'var(--space-6)', padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>×</button>
                    </div>
                    <div style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                      ${item.price.toFixed(2)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <div className="qty-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: '2px' }}>
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="qty-btn" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'transparent', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'transparent', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + var(--space-8))' }}>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>Order Summary</h2>
                
                {/* Order Type */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>Order Type</label>
                  <div style={{ display: 'flex', background: 'var(--color-bg-card)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                    <button onClick={() => setOrderType('dine-in')} style={{ flex: 1, padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 600, background: orderType === 'dine-in' ? 'var(--color-primary)' : 'transparent', color: orderType === 'dine-in' ? '#fff' : 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }}>Dine-In</button>
                    <button onClick={() => setOrderType('takeaway')} style={{ flex: 1, padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 600, background: orderType === 'takeaway' ? 'var(--color-primary)' : 'transparent', color: orderType === 'takeaway' ? '#fff' : 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }}>Takeaway</button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>RM{total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Service Fee (0%)</span>
                  <span style={{ fontWeight: 600 }}>RM0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '2px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-primary)' }}>RM{total.toFixed(2)}</span>
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>Special Instructions</label>
                  <textarea 
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Allergies, seating preferences, etc."
                    style={{ width: '100%', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', minHeight: '80px', resize: 'vertical' }}
                  />
                </div>

                <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Proceed to Checkout
                </Link>
                <Link href="/menu" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
