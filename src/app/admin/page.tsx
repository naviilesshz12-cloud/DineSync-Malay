'use client';

import { useEffect, useState } from 'react';
import { menuItems as initialMenuItems } from '@/lib/data';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { formatDistanceToNow } from 'date-fns';
import { useAdminStore } from '@/store/adminStore';
import { useRouter } from 'next/navigation';

type Tab = 'orders' | 'menu' | 'reservations';

export default function AdminPage() {
  const { isAdmin } = useAdminStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  
  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>Access Denied</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Redirecting to home...</p>
        </div>
      </div>
    );
  }
  const [orders, setOrders] = useState<any[]>([]);
  const [menuData, setMenuData] = useState(initialMenuItems);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
    const subscription = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchOrders();
  };

  const toggleAvailability = (id: string) => {
    setMenuData((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m))
    );
  };

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === 'pending'),
    cooking: orders.filter((o) => o.status === 'cooking'),
    ready: orders.filter((o) => o.status === 'ready'),
    completed: orders.filter((o) => o.status === 'completed'),
  };

  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter((o) => ['pending', 'cooking'].includes(o.status)).length,
    revenue: orders.reduce((sum, o) => sum + Number(o.total || 0), 0),
    reservations: 0,
  };

  return (
    <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Admin Header */}
      <div style={{
        background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-6) 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
                Admin Command Center
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Manage orders, menu, and reservations in real-time
              </p>
            </div>
            <Link href="/kitchen" className="btn btn-secondary btn-sm">
              🍳 Kitchen Display →
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { label: 'Total Orders', value: stats.totalOrders, icon: '📋', color: 'var(--color-primary)' },
              { label: 'Active Orders', value: stats.activeOrders, icon: '🔥', color: 'var(--color-accent)' },
              { label: 'Revenue', value: `RM${stats.revenue.toFixed(0)}`, icon: '💰', color: 'var(--color-success)' },
              { label: "Today's Reservations", value: stats.reservations, icon: '📅', color: 'var(--color-info)' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-1)' }}>{stat.label}</div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="admin-tabs-container">
            {(['orders', 'menu', 'reservations'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6) var(--space-16)' }}>
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="orders-grid">
            {(['pending', 'cooking', 'ready', 'completed'] as const).map((status) => (
              <div key={status}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  marginBottom: 'var(--space-4)', padding: 'var(--space-2) var(--space-4)',
                  background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
                }}>
                  <span className={`status-pill status-${status}`}>{status}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    ({ordersByStatus[status].length})
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {ordersByStatus[status].map((order) => (
                    <div key={order.id} style={{
                      background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`badge ${order.order_type === 'takeaway' ? 'badge-orange' : 'badge-blue'}`}>
                          {order.order_type}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{order.customer_name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                        {formatDistanceToNow(new Date(order.created_at))} ago
                      </div>
                      <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                        {order.items.map((item: any, i: number) => (
                          <li key={i}>• {item.quantity}x {item.name}</li>
                        ))}
                      </ul>
                      {order.special_instructions && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)', fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>
                          📝 {order.special_instructions}
                        </div>
                      )}
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>RM{Number(order.total).toFixed(2)}</div>

                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {status === 'pending' && (
                          <button className="btn btn-accent btn-sm" onClick={() => updateOrderStatus(order.id, 'cooking')}>
                            Start Cooking
                          </button>
                        )}
                        {status === 'cooking' && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                            Mark Ready
                          </button>
                        )}
                        {status === 'ready' && (
                          <button className="btn btn-primary btn-sm" style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)' }} onClick={() => updateOrderStatus(order.id, 'completed')}>
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {ordersByStatus[status].length === 0 && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                      No orders
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>Menu Management</h2>
              <button className="btn btn-primary btn-sm">+ Add Item</button>
            </div>
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Item</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Category</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Price</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Tags</th>
                    <th style={{ padding: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {menuData.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{item.category}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>RM{item.price.toFixed(2)}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                          {item.dietary_tags.map((tag) => (
                            <span key={tag} className={`dietary-tag dietary-${tag === 'vegan' ? 'vegan' : tag === 'gluten-free' ? 'gf' : 'spicy'}`}>{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center' }}>
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          style={{
                            width: '44px', height: '24px', borderRadius: 'var(--radius-full)',
                            background: item.available ? 'var(--color-success)' : 'var(--color-border)',
                            position: 'relative', transition: 'background var(--transition-fast)',
                          }}
                        >
                          <span style={{
                            position: 'absolute', top: '2px',
                            left: item.available ? '22px' : '2px',
                            width: '20px', height: '20px',
                            background: '#fff', borderRadius: 'var(--radius-full)',
                            transition: 'left var(--transition-fast)',
                          }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === 'reservations' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>Reservation Schedule</h2>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {demoReservations.map((res) => (
                <div key={res.id} style={{
                  background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                      background: 'var(--color-primary-glow)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                      color: 'var(--color-primary)', fontSize: 'var(--text-sm)',
                    }}>
                      {res.time}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{res.name}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        👥 {res.party} guests · 📅 {new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${res.status === 'confirmed' ? 'badge-green' : 'badge-orange'}`}>{res.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
        .stat-card {
           background: var(--color-surface); border: 1px solid var(--color-border);
           borderRadius: var(--radius-lg); padding: var(--space-5);
        }
        .admin-tabs-container {
          display: flex; gap: var(--space-1); marginTop: var(--space-6);
          background: var(--color-surface); borderRadius: var(--radius-lg);
          padding: var(--space-1); maxWidth: 400px;
        }
        .admin-tab {
          flex: 1; padding: var(--space-2) var(--space-4); borderRadius: var(--radius-md);
          fontWeight: 600; fontSize: var(--text-sm); textTransform: capitalize;
          transition: all var(--transition-fast);
        }
        .admin-tab.active {
          background: var(--color-bg-card); color: var(--color-primary);
          border: 1px solid var(--color-border);
        }
        .admin-tab:not(.active) { color: var(--color-text-muted); }

        .orders-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); alignItems: start; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .orders-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .orders-grid { grid-template-columns: 1fr; }
          .admin-tabs-container { max-width: 100%; border-radius: var(--radius-md); }
        }
      `}</style>
    </div>
  );
}
