// src/data/catalog.ts
// Static (mock) product catalog for the Sipora Café MVP.
// Marked as mock in PROJECT_MAP.md — replace with a real data source when a
// backend is introduced. Images are placeholders pending final photography.

import { Product } from '@/types/product';

const sizes: Product['customizations']['sizes'] = [
  { id: 'sm', label: 'Small', priceDelta: 0 },
  { id: 'md', label: 'Medium', priceDelta: 0.75 },
  { id: 'lg', label: 'Large', priceDelta: 1.5 },
];

const milks: Product['customizations']['milks'] = [
  { id: 'whole', label: 'Whole milk', priceDelta: 0 },
  { id: 'oat', label: 'Oat milk', priceDelta: 0.5 },
  { id: 'almond', label: 'Almond milk', priceDelta: 0.5 },
  { id: 'skim', label: 'Skim milk', priceDelta: 0 },
];

const shots: Product['customizations']['shots'] = [
  { id: 'single', label: 'Single', priceDelta: 0 },
  { id: 'double', label: 'Double', priceDelta: 1.0 },
  { id: 'triple', label: 'Triple', priceDelta: 2.0 },
];

const sweetness: Product['customizations']['sweetness'] = [
  { id: 'none', label: 'None', priceDelta: 0 },
  { id: 'light', label: 'Light', priceDelta: 0 },
  { id: 'regular', label: 'Regular', priceDelta: 0 },
  { id: 'extra', label: 'Extra', priceDelta: 0.25 },
];

export const defaultCustomizations: Product['customizations'] = { sizes, milks, shots, sweetness };

const imgCaramel = require('@/assets/images/products/caramel-latte.png');
const imgColdBrew = require('@/assets/images/products/iced-vanilla-cold-brew.png');
const imgCroissant = require('@/assets/images/products/almond-croissant.png');
const imgEspresso = require('@/assets/images/products/classic-espresso.png');
const imgCinnamon = require('@/assets/images/products/cinnamon-honey-latte.png');
const imgCascara = require('@/assets/images/products/cascara-nitro.png');
const imgBabka = require('@/assets/images/products/chocolate-babka.png');

export const CATALOG: Product[] = [
  {
    id: 'artisanal-caramel-latte',
    name: 'Artisanal Caramel Latte',
    category: 'hot',
    description: 'Espresso with steamed milk and a house-made caramel drizzle, finished with delicate heart latte art.',
    tastingNotes: 'Caramel, brown sugar, toasted almond',
    price: 5.5,
    rating: 4.8,
    reviewCount: 124,
    image: imgCaramel,
    customizations: defaultCustomizations,
  },
  {
    id: 'iced-vanilla-cold-brew',
    name: 'Iced Vanilla Cold Brew',
    category: 'iced',
    description: 'Slow-steeped cold brew topped with a cloud of vanilla sweet cream.',
    tastingNotes: 'Vanilla, cocoa, smooth finish',
    price: 5.25,
    rating: 4.7,
    reviewCount: 98,
    image: imgColdBrew,
    customizations: defaultCustomizations,
  },
  {
    id: 'double-espresso-almond-croissant',
    name: 'Double Espresso & Almond Croissant',
    category: 'pastries',
    description: 'A double shot of espresso paired with a flaky almond croissant.',
    tastingNotes: 'Roasted almond, butter, dark chocolate',
    price: 6.75,
    rating: 4.9,
    reviewCount: 76,
    image: imgCroissant,
    customizations: defaultCustomizations,
  },
  {
    id: 'classic-demitasse-espresso',
    name: 'Classic Demitasse Espresso',
    category: 'hot',
    description: 'A concentrated double shot with rich golden crema.',
    tastingNotes: 'Dark chocolate, cherry, hazelnut',
    price: 3.25,
    rating: 4.6,
    reviewCount: 210,
    image: imgEspresso,
    customizations: defaultCustomizations,
  },
  {
    id: 'cinnamon-honey-flat-white',
    name: 'Cinnamon Honey Flat White',
    category: 'hot',
    description: 'Ristretto shots with velvety microfoam, cinnamon, and wildflower honey.',
    tastingNotes: 'Cinnamon, honey, cocoa',
    price: 5.0,
    rating: 4.7,
    reviewCount: 64,
    image: imgCinnamon,
    customizations: defaultCustomizations,
  },
  {
    id: 'cascara-nitro-tonic',
    name: 'Cascara Nitro Tonic',
    category: 'iced',
    description: 'Nitro-infused cascara with a splash of tonic for a refreshing sparkle.',
    tastingNotes: 'Cherry, hibiscus, bright',
    price: 4.75,
    rating: 4.5,
    reviewCount: 41,
    image: imgCascara,
    customizations: defaultCustomizations,
  },
  {
    id: 'toasted-almond-croissant',
    name: 'Toasted Almond Croissant',
    category: 'pastries',
    description: 'Buttery croissant filled with almond cream and toasted slivers.',
    tastingNotes: 'Almond, butter, vanilla',
    price: 4.25,
    rating: 4.8,
    reviewCount: 89,
    image: imgBabka,
    customizations: defaultCustomizations,
  },
];

export function getProductById(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}

export function getProductsByCategory(category: Product['category'] | 'all'): Product[] {
  if (category === 'all') return CATALOG;
  return CATALOG.filter((p) => p.category === category);
}