import { menuItems } from '@/lib/data';
import { notFound } from 'next/navigation';
import AddToCartDetail from './AddToCartDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return menuItems.map((item) => ({ id: item.id }));
}

export default async function MenuDetailPage({ params }: Props) {
  const { id } = await params;
  const item = menuItems.find((i) => i.id === id);

  if (!item) return notFound();

  const relatedItems = menuItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 3);

  return (
    <div className="page-enter">
      <section style={{
        paddingTop: 'calc(var(--nav-height) + var(--space-10))',
        paddingBottom: 'var(--space-20)',
      }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-12)',
            alignItems: 'start',
          }}>
            {/* Image */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              position: 'relative',
            }}>
              <img
                src={item.image_url}
                alt={item.name}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
              {item.featured && (
                <div style={{
                  position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
                }} className="badge badge-gold">★ Featured</div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{
                fontSize: 'var(--text-xs)', textTransform: 'uppercase',
                letterSpacing: '1.5px', color: 'var(--color-primary)',
                fontWeight: 600, marginBottom: 'var(--space-2)',
              }}>
                {item.category}
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)',
                marginBottom: 'var(--space-4)',
              }}>
                {item.name}
              </h1>

              <div style={{
                display: 'flex', gap: 'var(--space-2)',
                marginBottom: 'var(--space-6)', flexWrap: 'wrap',
              }}>
                {item.dietary_tags.map((tag) => (
                  <span key={tag} className={`dietary-tag dietary-${tag === 'vegan' ? 'vegan' : tag === 'gluten-free' ? 'gf' : 'spicy'}`} style={{ padding: '4px 12px', fontSize: '12px' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <p style={{
                fontSize: 'var(--text-lg)', lineHeight: 1.8,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-8)',
              }}>
                {item.description}
              </p>

              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)',
                color: 'var(--color-primary)', fontWeight: 700,
                marginBottom: 'var(--space-8)',
              }}>
                ${item.price.toFixed(2)}
              </div>

              <AddToCartDetail item={item} />

              <div style={{
                marginTop: 'var(--space-8)', padding: 'var(--space-6)',
                background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}>
                <h4 style={{
                  fontFamily: 'var(--font-display)', marginBottom: 'var(--space-3)',
                  fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  Chef&apos;s Note
                </h4>
                <p style={{
                  fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
                  lineHeight: 1.7, fontStyle: 'italic',
                }}>
                  This dish is prepared fresh to order using seasonal ingredients. Please allow 15-20 minutes for preparation. Allergen information available upon request.
                </p>
              </div>
            </div>
          </div>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div style={{ marginTop: 'var(--space-20)' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
                marginBottom: 'var(--space-8)',
              }}>
                You Might Also Enjoy
              </h2>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-6)',
              }}>
                {relatedItems.map((related) => (
                  <a key={related.id} href={`/menu/${related.id}`} className="card" style={{ display: 'block' }}>
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={related.image_url} alt={related.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 'var(--space-4)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{related.name}</h3>
                      <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>RM{related.price.toFixed(2)}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
