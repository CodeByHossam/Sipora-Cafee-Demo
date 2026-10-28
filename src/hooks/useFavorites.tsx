// src/hooks/useFavorites.tsx
import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Product } from '@/types/product';
import { getAllProducts } from '@/data/homeProducts';

interface FavoritesContextValue {
  favoriteIds: string[];
  count: number;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  favoriteProducts: Product[];
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const favoriteProducts = useMemo(
    () => getAllProducts().filter((p) => favoriteIds.includes(p.id)),
    [favoriteIds]
  );

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, count: favoriteIds.length, isFavorite, toggleFavorite, removeFavorite, favoriteProducts }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}