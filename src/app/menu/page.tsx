'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { menuItems } from '@/lib/data';
import AddToCart from '@/components/AddToCart';

const categories = [
  { key: 'all', label: 'All', icon: '🍴' },
  { key: 'appetizers', label: 'Appetizers', icon: '🥗' },
  { key: 'mains', label: 'Mains', icon: '🥩' },
  { key: 'desserts', label: 'Desserts', icon: '🍰' },
  { key: 'drinks', label: 'Drinks', icon: '🍸' },
];

const dietaryFilters = [
  { key: 'vegan', label: 'Vegan', icon: '🌱' },
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { key: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDietary, setActiveDietary] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesDietary = activeDietary.length === 0 || activeDietary.every((d) => item.dietary_tags.includes(d));
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDietary && matchesSearch;
    });
  }, [activeCategory, activeDietary, searchQuery]);

  const toggleDietary = (key: string) => {
    setActiveDietary((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="menu-hero">
        <div className="container">
          <p className="section-eyebrow gold-accent">◆ Our Culinary Collection</p>
          <h1 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>The Menu</h1>
          <div className="gold-line" />
          <p className="section-subtitle">
            Each dish is a masterpiece crafted with seasonal ingredients and international inspiration
          </p>
        </div>
      </section>

      <section className="menu-content container">
        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span className="tab-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="dietary-filters">
            {dietaryFilters.map((filter) => (
              <button
                key={filter.key}
                className={`dietary-btn ${activeDietary.includes(filter.key) ? 'active' : ''}`}
                onClick={() => toggleDietary(filter.key)}
              >
                {filter.icon} {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-card card">
              <Link href={`/menu/${item.id}`} className="menu-card-img-link">
                <div className="menu-card-img">
                  <img src={item.image_url} alt={item.name} loading="lazy" />
                  <div className="img-overlay" />
                  {item.featured && <div className="featured-badge badge badge-gold">★ Featured</div>}
                  <div className="card-tags">
                    {item.dietary_tags.map((tag) => (
                      <span key={tag} className={`dietary-tag dietary-${tag === 'vegan' ? 'vegan' : tag === 'gluten-free' ? 'gf' : 'spicy'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <div className="menu-card-body">
                <div className="card-category">{item.category}</div>
                <Link href={`/menu/${item.id}`}>
                  <h3 className="card-title">{item.name}</h3>
                </Link>
                <p className="card-desc">{item.description.substring(0, 90)}...</p>
                <div className="card-footer">
                  <span className="card-price">RM{item.price.toFixed(2)}</span>
                  <AddToCart item={item} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="empty-state">
            <p style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>No dishes found</p>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </section>

      <style jsx>{`
        .menu-hero {
          padding: calc(var(--nav-height) + var(--space-16)) 0 var(--space-12);
          text-align: center;
          background: var(--color-bg-card);
          border-bottom: 1px solid var(--color-border);
        }
        .section-eyebrow {
          font-size: var(--text-sm);
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: var(--space-2);
        }
        .menu-content {
          padding: var(--space-10) var(--space-6) var(--space-20);
        }

        /* Filters */
        .filters-bar {
          margin-bottom: var(--space-10);
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: var(--space-3) var(--space-5);
          margin-bottom: var(--space-6);
          max-width: 400px;
          transition: border-color var(--transition-fast);
        }
        .search-bar:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-glow);
        }
        .search-bar svg { color: var(--color-text-muted); flex-shrink: 0; }
        .search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: var(--text-sm);
          color: var(--color-text);
        }
        .search-input::placeholder { color: var(--color-text-muted); }

        .category-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: var(--space-2);
        }
        .category-tab {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-5);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .category-tab:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        .category-tab.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-text-inverse);
        }
        .tab-icon { font-size: var(--text-base); }

        .dietary-filters {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .dietary-btn {
          padding: var(--space-1) var(--space-4);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }
        .dietary-btn:hover {
          border-color: var(--color-primary);
        }
        .dietary-btn.active {
          background: var(--color-primary-glow);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        /* Menu Grid */
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        .menu-card {
          display: flex;
          flex-direction: column;
        }
        .menu-card-img {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .menu-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .menu-card:hover .menu-card-img img {
          transform: scale(1.06);
        }
        .img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%);
        }
        .featured-badge {
          position: absolute;
          top: var(--space-3);
          right: var(--space-3);
        }
        .card-tags {
          position: absolute;
          bottom: var(--space-3);
          left: var(--space-3);
          display: flex;
          gap: var(--space-1);
        }
        .menu-card-body {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-category {
          font-size: var(--text-xs);
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-primary);
          font-weight: 600;
          margin-bottom: var(--space-1);
        }
        .card-title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          margin-bottom: var(--space-2);
          transition: color var(--transition-fast);
        }
        .card-title:hover { color: var(--color-primary); }
        .card-desc {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-4);
          flex: 1;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
        }
        .card-price {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 600;
          color: var(--color-primary);
        }

        @media (max-width: 1024px) { .menu-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .menu-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
