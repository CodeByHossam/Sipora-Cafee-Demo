// src/types/cart.ts
import { Product } from './product';

export interface CartOptions {
  size: string;
  milk: string;
  shot: string;
  sweet: string;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: Product['image'];
  options: CartOptions;
  customizations: Product['customizations'];
  basePrice: number;
  qty: number;
  unitPrice: number;
}