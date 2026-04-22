'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotal, orderType, specialInstructions, setSpecialInstructions, clearCart } = useCartStore();
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const supabase = (await import('@/lib/supabase-browser')).createClient();

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: guestName,
        customer_phone: phone,
        items: items,
        total: getTotal(),
        order_type: orderType,
        special_instructions: specialInstructions,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error placing order:', orderError);
      setLoading(false);
      return;
    }

    setOrderId(orderData.id.slice(0, 8).toUpperCase());
    setPlaced(true);
    clearCart();
    setLoading(false);
  };

  if (placed) {
    return (
      <div style={{ paddingTop: 'calc(var(--nav-height) + var(--space-16))', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="page-enter">
        <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)', animation: 'scaleIn 0.5s ease' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
            Order Placed!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
            Your order <strong style={{ color: 'var(--color-primary)' }}>{orderId}</strong> has been received.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)' }}>
            {orderType === 'dine-in' ? 'Your order will be prepared and served at your table.' : 'Your order will be ready for pickup shortly.'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <Link href="/menu" className="btn btn-primary">Continue Browsing</Link>
            <Link href="/" className="btn btn-secondary">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <section style={{
        paddingTop: 'calc(var(--nav-height) + var(--space-16))',
        paddingBottom: 'var(--space-12)',
        textAlign: 'center',
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Checkout</h1>
          <div className="gold-line" />
        </div>
      </section>

      <section className="container" style={{ padding: 'var(--space-10) var(--space-6) var(--space-20)', maxWidth: '900px' }}>
        {items.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Your cart is empty</p>
            <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-grid">
              {/* Order Summary */}
              <div>
                <h2 className="step-title">Order Summary</h2>
                <div className="order-summary-card">
                  <div className="type-badge">
                    {orderType === 'dine-in' ? '🍽️ Dine-In' : '📦 Takeaway'}
                  </div>

                  {items.map((item) => (
                    <div key={item.id} className="item-row">
                      <div className="item-info">
                        <div className="item-img-container">
                          <img src={item.image_url} alt={item.name} className="item-img" />
                        </div>
                        <div>
                          <div className="item-name">{item.name}</div>
                          <div className="item-qty">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="item-price">
                        RM{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="total-row">
                    <span>Total</span>
                    <span className="total-price">
                      RM{getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 'var(--space-6)' }}>
                  <label className="form-label">Special Instructions for the Chef</label>
                  <textarea
                    className="form-input"
                    placeholder="Allergies, preferences, spice level..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <h2 className="step-title">Your Details</h2>
                <div className="details-card">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" placeholder="Your name" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" placeholder="+60 12-345 6789" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>

                  <div className="payment-notice">
                    <p>💳 Payment will be collected at the restaurant. Online payment integration coming soon.</p>
                  </div>

                  <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Placing Order...' : `Place Order · RM${getTotal().toFixed(2)}`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </section>

      <style jsx>{`
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: var(--space-10);
          align-items: start;
        }
        .step-title {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          margin-bottom: var(--space-6);
        }
        .order-summary-card, .details-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
        }
        .type-badge {
          margin-bottom: var(--space-4);
          padding: var(--space-2) var(--space-4);
          background: var(--color-primary-glow);
          border-radius: var(--radius-md);
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-primary);
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--color-border);
        }
        .item-info { display: flex; gap: var(--space-3); alignItems: center; }
        .item-img-container { width: 48px; height: 48px; border-radius: var(--radius-sm); overflow: hidden; }
        .item-img { width: 100%; height: 100%; object-fit: cover; }
        .item-name { fontWeight: 600; fontSize: var(--text-sm); }
        .item-qty { fontSize: var(--text-xs); color: var(--color-text-muted); }
        .item-price { fontWeight: 600; color: var(--color-primary); }
        .total-row { display: flex; justifyContent: space-between; paddingTop: var(--space-4); fontSize: var(--text-lg); fontWeight: 700; }
        .total-price { color: var(--color-primary); fontFamily: var(--font-display); fontSize: var(--text-2xl); }
        .payment-notice { background: var(--color-surface); borderRadius: var(--radius-md); padding: var(--space-4); marginBottom: var(--space-6); border: 1px solid var(--color-border); fontSize: var(--text-xs); color: var(--color-text-muted); lineHeight: 1.6; }

        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr; gap: var(--space-8); }
        }
      `}</style>
    </div>
  );
}
