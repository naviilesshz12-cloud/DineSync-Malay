'use client';

import Link from 'next/link';
import { menuItems, reviews, restaurantInfo } from '@/lib/data';

export default function HomePage() {
  const featuredDishes = menuItems.filter((item) => item.featured);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-badge">✦ Fine Dining Reimagined</div>
          <h1 className="hero-title">
            Experience Culinary<br />
            <span className="gold-accent">Excellence</span>
          </h1>
          <p className="hero-subtitle">
            {restaurantInfo.description}
          </p>
          <div className="hero-actions">
            <Link href="/reservations" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Book a Table
            </Link>
            <Link href="/menu" className="btn btn-secondary btn-lg">
              Explore Menu
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">4.9</span>
              <span className="stat-label">★ Rating</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">2K+</span>
              <span className="stat-label">Happy Guests</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">18</span>
              <span className="stat-label">Signature Dishes</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="section featured-section">
        <div className="container">
          <p className="section-eyebrow gold-accent">◆ Chef&apos;s Selection</p>
          <h2 className="section-title">Signature Dishes</h2>
          <div className="gold-line" />
          <p className="section-subtitle">Crafted with passion using the finest seasonal ingredients from around the world</p>

          <div className="featured-grid">
            {featuredDishes.map((dish, index) => (
              <Link href={`/menu/${dish.id}`} key={dish.id} className={`featured-card stagger-${index + 1} animate-fade-in-up`}>
                <div className="featured-img">
                  <img src={dish.image_url} alt={dish.name} loading="lazy" />
                  <div className="featured-img-overlay" />
                  {dish.dietary_tags.length > 0 && (
                    <div className="featured-tags">
                      {dish.dietary_tags.map((tag) => (
                        <span key={tag} className={`dietary-tag dietary-${tag === 'vegan' ? 'vegan' : tag === 'gluten-free' ? 'gf' : 'spicy'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="featured-info">
                  <div className="featured-category">{dish.category}</div>
                  <h3>{dish.name}</h3>
                  <p>{dish.description.substring(0, 80)}...</p>
                  <div className="featured-price">RM{dish.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <Link href="/menu" className="btn btn-secondary">View Full Menu →</Link>
          </div>
        </div>
      </section>

      {/* Why DineSync Strip */}
      <section className="section why-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🍽️</div>
              <h3>Farm-to-Table</h3>
              <p>Premium ingredients sourced daily from local farms and artisan producers</p>
            </div>
            <div className="why-card">
              <div className="why-icon">👨‍🍳</div>
              <h3>Master Chefs</h3>
              <p>Michelin-trained culinary artists pushing the boundaries of modern cuisine</p>
            </div>
            <div className="why-card">
              <div className="why-icon">📱</div>
              <h3>Seamless Digital</h3>
              <p>Order ahead, track in real-time, and enjoy a friction-free dining experience</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🌿</div>
              <h3>Dietary Inclusive</h3>
              <p>Vegan, gluten-free, and allergen-aware options without compromising flavor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story / Philosophy */}
      <section className="section story-section">
        <div className="container">
          <div className="story-flex">
            <div className="story-content">
              <p className="section-eyebrow gold-accent">◆ Our Philosophy</p>
              <h2 className="section-title" style={{ textAlign: 'left', margin: '0 0 var(--space-6)' }}>The Art of Slow Dining</h2>
              <p className="story-text">
                At DineSync, we believe that food is more than sustenance—it's a dialogue between the earth and the soul. Our journey began with a simple vision: to bridge the gap between traditional culinary heritage and modern innovation.
              </p>
              <p className="story-text">
                Every dish is a carefully composed symphony of flavors, textures, and aromas. We source our ingredients with meticulous care, partnering exclusively with local artisans and regenerative farms that share our commitment to sustainability and absolute quality.
              </p>
              <div className="story-stats">
                <div className="story-stat-item">
                  <span className="gold-accent">100%</span>
                  <span>Organic Produce</span>
                </div>
                <div className="story-stat-item">
                  <span className="gold-accent">0m</span>
                  <span>Carbon Neutral Ambition</span>
                </div>
              </div>
            </div>
            <div className="story-image-container">
              <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800" alt="Chef preparing dish" className="story-image" />
              <div className="story-image-overlay" />
              <div className="story-experience-chip">
                <span className="chip-year">Est.</span>
                <span className="chip-value">2012</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonial-section">
        <div className="container">
          <p className="section-eyebrow gold-accent">◆ Guest Reviews</p>
          <h2 className="section-title">What Our Guests Say</h2>
          <div className="gold-line" />
          <div className="testimonial-grid">
            {reviews.map((review) => (
              <div key={review.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="testimonial-text">&ldquo;{review.comment}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{review.author_name?.[0]}</div>
                  <div>
                    <div className="author-name">{review.author_name}</div>
                    <div className="author-date">
                      {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for an Unforgettable Evening?</h2>
            <p>Reserve your table now and experience the art of modern dining</p>
            <div className="cta-actions">
              <Link href="/reservations" className="btn btn-primary btn-lg">Book a Table</Link>
              <Link href="/menu" className="btn btn-secondary btn-lg">Order Takeaway</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Hero */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop') center/cover no-repeat;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          padding-top: var(--nav-height);
        }
        .hero-badge {
          display: inline-block;
          padding: var(--space-2) var(--space-4);
          background: var(--color-primary-glow);
          border: 1px solid rgba(200, 168, 92, 0.3);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: var(--space-6);
          animation: fadeInUp 0.6s ease;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: var(--text-7xl);
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: var(--space-6);
          animation: fadeInUp 0.7s ease 0.1s forwards;
          opacity: 0;
        }
        .hero-subtitle {
          font-size: var(--text-lg);
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-10);
          max-width: 540px;
          animation: fadeInUp 0.7s ease 0.2s forwards;
          opacity: 0;
        }
        .hero-actions {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-12);
          animation: fadeInUp 0.7s ease 0.3s forwards;
          opacity: 0;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          animation: fadeInUp 0.7s ease 0.4s forwards;
          opacity: 0;
        }
        .stat-number {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--color-primary);
          display: block;
        }
        .stat-label {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }
        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-border);
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: var(--space-10);
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }
        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--color-primary), transparent);
          animation: float 2s ease-in-out infinite;
        }

        /* Section Eyebrow */
        .section-eyebrow {
          text-align: center;
          font-size: var(--text-sm);
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: var(--space-2);
        }

        /* Featured */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        .featured-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
        }
        .featured-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }
        .featured-img {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .featured-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .featured-card:hover .featured-img img {
          transform: scale(1.08);
        }
        .featured-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
        }
        .featured-tags {
          position: absolute;
          top: var(--space-3);
          left: var(--space-3);
          display: flex;
          gap: var(--space-1);
        }
        .featured-info {
          padding: var(--space-5);
        }
        .featured-category {
          font-size: var(--text-xs);
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-primary);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }
        .featured-info h3 {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          margin-bottom: var(--space-2);
        }
        .featured-info p {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-3);
        }
        .featured-price {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          color: var(--color-primary);
          font-weight: 600;
        }

        /* Why */
        .why-section {
          background: var(--color-bg-card);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
        }
        .why-card {
          text-align: center;
          padding: var(--space-8) var(--space-4);
        }
        .why-icon {
          font-size: 2.5rem;
          margin-bottom: var(--space-4);
        }
        .why-card h3 {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          margin-bottom: var(--space-3);
        }
        .why-card p {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        /* Story Section */
        .story-section {
          background: var(--color-surface);
          overflow: hidden;
        }
        .story-flex {
          display: flex;
          align-items: center;
          gap: var(--space-16);
        }
        .story-content { flex: 1; }
        .story-text {
          font-size: var(--text-base);
          line-height: 1.8;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-6);
        }
        .story-stats {
          display: flex;
          gap: var(--space-10);
          margin-top: var(--space-10);
        }
        .story-stat-item {
          display: flex;
          flex-direction: column;
        }
        .story-stat-item span:first-child {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-weight: 700;
        }
        .story-stat-item span:last-child {
          font-size: var(--text-xs);
          text-transform: uppercase;
          color: var(--color-text-muted);
          letter-spacing: 1px;
        }
        .story-image-container {
          flex: 1;
          position: relative;
          height: 500px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        .story-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .story-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(200, 168, 92, 0.1) 0%, transparent 100%);
        }
        .story-experience-chip {
          position: absolute;
          bottom: var(--space-8);
          right: var(--space-8);
          background: var(--color-bg);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }
        .chip-year { font-size: var(--text-xs); color: var(--color-text-muted); }
        .chip-value { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700; color: var(--color-primary); }

        /* Testimonials */
        .testimonial-section {
          background: var(--color-bg);
        }
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
        }
        .testimonial-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          transition: all var(--transition-base);
        }
        .testimonial-card:hover {
          border-color: var(--color-border-light);
          transform: translateY(-2px);
        }
        .testimonial-stars {
          color: var(--color-primary);
          font-size: var(--text-lg);
          margin-bottom: var(--space-4);
          letter-spacing: 2px;
        }
        .testimonial-text {
          font-size: var(--text-base);
          line-height: 1.7;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-6);
          font-style: italic;
        }
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .author-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--color-text-inverse);
          font-size: var(--text-sm);
        }
        .author-name {
          font-weight: 600;
          font-size: var(--text-sm);
        }
        .author-date {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        /* CTA Banner */
        .cta-banner {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, var(--color-bg) 100%);
          border-top: 1px solid var(--color-border);
          padding: var(--space-20) 0;
        }
        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .cta-content h2 {
          font-family: var(--font-display);
          font-size: var(--text-4xl);
          margin-bottom: var(--space-4);
        }
        .cta-content p {
          font-size: var(--text-lg);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-8);
        }
        .cta-actions {
          display: flex;
          justify-content: center;
          gap: var(--space-4);
        }

        @media (max-width: 1024px) {
          .featured-grid { grid-template-columns: repeat(2, 1fr); }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: var(--text-4xl); }
          .hero-subtitle { font-size: var(--text-base); }
          .hero-actions { flex-direction: column; }
          .hero-stats { flex-wrap: wrap; gap: var(--space-4); }
          .featured-grid { grid-template-columns: 1fr; }
          .why-grid { grid-template-columns: 1fr; }
          .testimonial-grid { grid-template-columns: 1fr; }
          .cta-actions { flex-direction: column; align-items: center; }
          .cta-content h2 { font-size: var(--text-3xl); }
          .story-flex { flex-direction: column; gap: var(--space-10); }
          .story-stats { gap: var(--space-6); justify-content: center; }
          .story-image-container { height: 350px; width: 100%; }
        }
      `}</style>
    </div>
  );
}
