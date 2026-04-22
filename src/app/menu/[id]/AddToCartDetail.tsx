'use client';

import AddToCart from '@/components/AddToCart';
import { MenuItem } from '@/lib/types';

export default function AddToCartDetail({ item }: { item: MenuItem }) {
  return <AddToCart item={item} />;
}
