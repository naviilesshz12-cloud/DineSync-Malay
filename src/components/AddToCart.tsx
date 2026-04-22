'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { MenuItem } from '@/lib/types';

interface Props {
  item: MenuItem;
}

export default function AddToCart({ item }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image_url: item.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setQuantity(1);
  };

  if (!item.available) {
    return <button className="btn btn-ghost btn-sm" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Unavailable</button>;
  }

  return (
    <div className="add-to-cart">
      <div className="qty-selector">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease">−</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase">+</button>
      </div>
      <button className={`btn ${added ? 'btn-added' : 'btn-accent'}`} onClick={handleAdd}>
        {added ? '✓ Added!' : `Add · RM${(item.price * quantity).toFixed(2)}`}
      </button>

      <style jsx>{`
        .add-to-cart {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .qty-selector {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .qty-selector button {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          font-size: var(--text-base);
        }
        .qty-selector button:hover {
          background: var(--color-surface-hover);
          color: var(--color-primary);
        }
        .qty-selector span {
          width: 34px;
          text-align: center;
          font-weight: 600;
          font-size: var(--text-sm);
        }
        .btn-added {
          background: var(--color-success) !important;
          color: #fff !important;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
