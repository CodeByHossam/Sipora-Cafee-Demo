// src/data/homeProducts.ts
// Loads the JSON "database" of products and resolves image assets.
// Used by the Home page for the dynamic Hero banner and Popular choices.

import { Product } from '@/types/product';
import { defaultCustomizations, CATALOG, getProductById as getCatalogProduct } from '@/data/catalog';
import productsJson from './products.json';

interface JsonProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  isHero: boolean;
  discountPercentage: number;
  isPopular: boolean;
}

const IMAGE_MAP: Record<string, number> = {
'spiced-latee.png': require('@/assets/images/products/spiced-latee.png'),
  'caramel-latte.png': require('@/assets/images/products/caramel-latte.png'),
  'iced-vanilla-cold-brew.png': require('@/assets/images/products/iced-vanilla-cold-brew.png'),
  'almond-croissant.png': require('@/assets/images/products/almond-croissant.png'),
  'classic-espresso.png': require('@/assets/images/products/classic-espresso.png'),
  'cinnamon-honey-latte.png': require('@/assets/images/products/cinnamon-honey-latte.png'),
  'cascara-nitro.png': require('@/assets/images/products/cascara-nitro.png'),
  'chocolate-babka.png': require('@/assets/images/products/chocolate-babka.png'),
};

export interface HomeProduct extends Product {
  isHero: boolean;
  discountPercentage: number;
  isPopular: boolean;
}

function toHomeProduct(jp: JsonProduct): HomeProduct {
  const image = IMAGE_MAP[jp.image] ?? IMAGE_MAP['caramel-latte.png'];
  const categoryMap: Record<string, Product['category']> = {
    Espresso: 'hot',
    'Cold Brew': 'iced',
    Pastries: 'pastries',
  };
  return {
    id: jp.id,
    name: jp.name,
    category: categoryMap[jp.category] ?? 'hot',
    description: jp.description,
    tastingNotes: jp.description,
    price: jp.basePrice,
    rating: 4.7,
    reviewCount: 0,
    image,
    customizations: defaultCustomizations,
    isHero: jp.isHero,
    discountPercentage: jp.discountPercentage,
    isPopular: jp.isPopular,
  };
}

export const HOME_PRODUCTS: HomeProduct[] = (productsJson as { products: JsonProduct[] }).products.map(toHomeProduct);

export function getHeroProduct(): HomeProduct | undefined {
  return HOME_PRODUCTS.find((p) => p.isHero);
}

export function getPopularProducts(): HomeProduct[] {
  return HOME_PRODUCTS.filter((p) => p.isPopular);
}

export function discountedPrice(product: HomeProduct | Product): number {
  const pct = product.discountPercentage ?? 0;
  if (!pct) return product.price;
  return Math.round(product.price * (1 - pct / 100) * 100) / 100;
}

export function getAllProducts(): Product[] {
  const ids = new Set<string>();
  const result: Product[] = [];
  for (const p of CATALOG) {
    if (!ids.has(p.id)) { ids.add(p.id); result.push(p); }
  }
  for (const p of HOME_PRODUCTS) {
    if (!ids.has(p.id)) { ids.add(p.id); result.push(p); }
  }
  return result;
}

export function getProductById(id: string): Product | undefined {
  const fromCatalog = getCatalogProduct(id);
  if (fromCatalog) return fromCatalog;
  return HOME_PRODUCTS.find((p) => p.id === id);
}