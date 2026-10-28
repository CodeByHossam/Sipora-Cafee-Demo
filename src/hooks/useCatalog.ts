// src/hooks/useCatalog.ts
import { useMemo } from 'react';
import { CATALOG, getProductsByCategory } from '@/data/catalog';
import { Product } from '@/types/product';

export function useCatalog(category: Product['category'] | 'all' = 'all') {
  const products = useMemo(() => getProductsByCategory(category), [category]);
  return { products, all: CATALOG };
}