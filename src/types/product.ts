// src/types/product.ts
export type ProductCategory = 'hot' | 'iced' | 'pastries' | 'all';

export interface CustomizationOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface ProductCustomizations {
  sizes: CustomizationOption[];
  milks: CustomizationOption[];
  shots: CustomizationOption[];
  sweetness: CustomizationOption[];
}

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'all'>;
  description: string;
  tastingNotes: string;
  price: number; // base price in USD
  rating: number; // 0-5
  reviewCount: number;
  image: number; // require() asset id
  customizations: ProductCustomizations;
  isHero?: boolean;
  discountPercentage?: number;
  isPopular?: boolean;
}