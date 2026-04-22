'use client';

import Link from 'next/link';
import { menuItems } from '@/lib/data';
import AddToCart from '@/components/AddToCart';

export default function OrderPage() {
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
          <p className="gold-accent" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>◆ Order Online</p>
          <h1 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Place Your Order</h1>
          <div className="gold-line" />
          <p className="section-subtitle">Browse our menu, add to cart, and checkout. Dine-in or takeaway — your choice.</p>
        </div>
      </section>

      <section className="container" style={{ padding: 'var(--space-10) var(--space-6) var(--space-20)' }}>
        {(['appetizers', 'mains', 'desserts', 'drinks'] as const).map((category) => {
          const items = menuItems.filter((i) => i.category === category);
          return (
            <div key={category} style={{ marginBottom: 'var(--space-12)' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
                textTransform: 'capitalize', marginBottom: 'var(--space-6)',
                paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)',
              }}>
                {category === 'appetizers' ? '🥗 ' : category === 'mains' ? '🥩 ' : category === 'desserts' ? '🍰 ' : '🍸 '}
                {category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex', gap: 'var(--space-4)', alignItems: 'center',
                    background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
                    transition: 'all var(--transition-fast)',
                  }}>
                    <Link href={`/menu/${item.id}`} style={{ flexShrink: 0 }}>
                      <div style={{
                        width: '80px', height: '80px', borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                      }}>
                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/menu/${item.id}`}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{item.name}</h3>
                      </Link>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
                        {item.dietary_tags.map((tag) => (
                          <span key={tag} className={`dietary-tag dietary-${tag === 'vegan' ? 'vegan' : tag === 'gluten-free' ? 'gf' : 'spicy'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-primary)', fontWeight: 600 }}>
                        ${item.price.toFixed(2)}
                      </span>
                      <AddToCart item={item} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
