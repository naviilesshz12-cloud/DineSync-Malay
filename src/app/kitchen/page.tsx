'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { differenceInMinutes } from 'date-fns';

export default function KitchenPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [now, setNow] = useState(new Date());
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
    const subscription = supabase
      .channel('kitchen_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    const timer = setInterval(() => setNow(new Date()), 30000); // Check every 30s
    return () => {
      supabase.removeChannel(subscription);
      clearInterval(timer);
    };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'cooking', 'ready'])
      .order('created_at', { ascending: true });
    if (data) setOrders(data);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchOrders();
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const cookingOrders = orders.filter((o) => o.status === 'cooking');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'var(--color-text)' }}>
      {/* Kitchen Header */}
      <div style={{
        background: 'var(--color-bg-elevated)', borderBottom: '2px solid var(--color-border)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>
            🍳 Kitchen Display
          </h1>
          <div style={{
            display: 'flex', gap: 'var(--space-4)', marginLeft: 'var(--space-8)',
            fontSize: 'var(--text-sm)',
          }}>
            <span style={{ color: 'var(--color-warning)' }}>⏳ Pending: {pendingOrders.length}</span>
            <span style={{ color: 'var(--color-accent)' }}>🔥 Cooking: {cookingOrders.length}</span>
            <span style={{ color: 'var(--color-success)' }}>✅ Ready: {readyOrders.length}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-primary)' }}>
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <Link href="/admin" className="btn btn-ghost btn-sm">← Admin</Link>
        </div>
      </div>

      {/* Order Columns */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr',
        gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-6)',
        height: 'calc(100vh - 65px)', overflow: 'hidden',
      }}>
        {/* PENDING */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            background: 'rgba(240, 160, 48, 0.15)', border: '1px solid rgba(240, 160, 48, 0.3)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-3)', textAlign: 'center',
            fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-warning)',
            textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            ⏳ New Orders ({pendingOrders.length})
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pendingOrders.map((order) => (
              <div key={order.id} style={{
                background: 'var(--color-bg-card)', border: '2px solid rgba(240, 160, 48, 0.4)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 'var(--text-lg)' }}>{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`badge ${order.order_type === 'takeaway' ? 'badge-orange' : 'badge-blue'}`}>{order.order_type}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>{order.customer_name}</div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  {order.items.map((item: any, i: number) => (
                    <div key={i} style={{
                      padding: 'var(--space-2) 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                      fontSize: 'var(--text-base)', fontWeight: 500,
                    }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 700, marginRight: 'var(--space-2)' }}>{item.quantity}x</span>
                      {item.name}
                    </div>
                  ))}
                </div>
                {order.special_instructions && (
                  <div style={{
                    background: 'rgba(240, 160, 48, 0.1)', border: '1px solid rgba(240, 160, 48, 0.3)',
                    borderRadius: 'var(--radius-sm)', padding: 'var(--space-2) var(--space-3)',
                    fontSize: 'var(--text-sm)', color: 'var(--color-warning)', marginBottom: 'var(--space-3)',
                  }}>
                    📝 {order.special_instructions}
                  </div>
                )}
                <button
                  className="btn btn-accent"
                  style={{ width: '100%', fontSize: 'var(--text-base)', padding: 'var(--space-3)' }}
                  onClick={() => updateStatus(order.id, 'cooking')}
                >
                  🔥 Start Cooking
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COOKING */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            background: 'rgba(232, 93, 74, 0.15)', border: '1px solid rgba(232, 93, 74, 0.3)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-3)', textAlign: 'center',
            fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-accent)',
            textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            🔥 In Progress ({cookingOrders.length})
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', alignContent: 'start' }}>
            {cookingOrders.map((order) => {
              const elapsed = differenceInMinutes(now, new Date(order.created_at));
              return (
                <div key={order.id} style={{
                  background: 'var(--color-bg-card)', border: `2px solid ${elapsed > 12 ? 'rgba(232, 93, 74, 0.6)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.id.slice(0, 8).toUpperCase()}</span>
                    <span style={{
                      fontSize: 'var(--text-sm)', fontWeight: 700,
                      color: elapsed > 12 ? 'var(--color-error)' : 'var(--color-text-muted)',
                    }}>
                      {elapsed}m
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{order.customer_name}</div>
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    {order.items.map((item: any, i: number) => (
                      <div key={i} style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-1) 0' }}>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{item.quantity}x</span> {item.name}
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => updateStatus(order.id, 'ready')}
                  >
                    ✅ Mark Ready
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* READY */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            background: 'rgba(78, 203, 113, 0.15)', border: '1px solid rgba(78, 203, 113, 0.3)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-3)', textAlign: 'center',
            fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-success)',
            textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            ✅ Ready to Serve ({readyOrders.length})
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {readyOrders.map((order) => (
              <div key={order.id} style={{
                background: 'var(--color-bg-card)', border: '2px solid rgba(78, 203, 113, 0.4)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 800, color: 'var(--color-success)', fontSize: 'var(--text-lg)' }}>{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`badge ${order.order_type === 'takeaway' ? 'badge-orange' : 'badge-blue'}`}>{order.order_type}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>
                  {order.customer_name}
                </div>
                <div style={{
                  textAlign: 'center', padding: 'var(--space-3)',
                  background: 'rgba(78, 203, 113, 0.1)', borderRadius: 'var(--radius-md)',
                  color: 'var(--color-success)', fontWeight: 700, fontSize: 'var(--text-base)',
                }}>
                  {order.order_type === 'takeaway' ? '📦 Ready for Pickup' : '🍽️ Ready to Serve'}
                </div>
                <button
                   className="btn btn-primary btn-sm"
                   style={{ width: '100%', marginTop: 'var(--space-3)', background: 'var(--color-success)', border: 'none' }}
                   onClick={() => updateStatus(order.id, 'completed')}
                >
                  Completed
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
