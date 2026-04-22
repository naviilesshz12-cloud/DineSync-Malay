'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { formatDistanceToNow } from 'date-fns';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    setOrder(null);

    // Search by ID (allowing for partial/short ID or full ID)
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .or(`id.eq.${orderId},id.ilike.${orderId}%`)
      .maybeSingle();

    if (fetchError) {
      setError('An error occurred while fetching your order.');
    } else if (!data) {
      setError('Order not found. Please check your Order ID.');
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'cooking', 'ready', 'completed'];
    return steps.indexOf(status);
  };

  return (
    <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '600px', padding: 'var(--space-12) var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
          Track Your Order
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
          Enter your order ID to see real-time preparation status
        </p>

        <form onSubmit={handleTrack} style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="text"
              placeholder="e.g. ORD-X7K2"
              className="form-input"
              style={{ flex: 1, fontSize: 'var(--text-lg)', padding: 'var(--space-4)' }}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <div style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)', textAlign: 'center' }}>{error}</div>}
        </form>

        {order && (
          <div className="card page-enter" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{order.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Placed</div>
                <div style={{ fontSize: 'var(--text-sm)' }}>{formatDistanceToNow(new Date(order.created_at))} ago</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                {['Received', 'Cooking', 'Ready', 'Served'].map((label, i) => (
                  <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: 'var(--radius-full)', 
                      background: getStatusStep(order.status) >= i ? 'var(--color-success)' : 'var(--color-surface)',
                      color: getStatusStep(order.status) >= i ? '#fff' : 'var(--color-text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto var(--space-2)', fontSize: 'var(--text-xs)',
                      border: '2px solid', borderColor: getStatusStep(order.status) >= i ? 'var(--color-success)' : 'var(--color-border)',
                      transition: 'all 0.5s ease'
                    }}>
                      {getStatusStep(order.status) >= i ? '✓' : i + 1}
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', fontWeight: getStatusStep(order.status) === i ? 700 : 400,
                      color: getStatusStep(order.status) >= i ? 'var(--color-text)' : 'var(--color-text-muted)'
                    }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: '4px', background: 'var(--color-surface)', borderRadius: '2px', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, height: '100%', 
                  width: `${(getStatusStep(order.status) / 3) * 100}%`, 
                  background: 'var(--color-success)', borderRadius: '2px',
                  transition: 'width 0.8s ease-in-out'
                }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>Order Summary</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {order.items.map((item: any, i: number) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>RM{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px dashed var(--color-border)', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>RM{Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            {order.status === 'ready' && (
              <div className="pulse-success" style={{ 
                marginTop: 'var(--space-8)', padding: 'var(--space-4)', 
                background: 'rgba(78, 203, 113, 0.1)', border: '1px solid var(--color-success)',
                borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--color-success)',
                fontWeight: 700
              }}>
                🎉 Your order is ready! {order.order_type === 'takeaway' ? 'Come to the pickup counter.' : 'A server is on their way.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
