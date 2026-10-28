import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import { Product } from '@/types/product';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onQuickAdd?: () => void;
  variant?: 'vertical' | 'horizontal';
}

export const ProductCard = React.memo(function ProductCard({ product, onPress, onQuickAdd, variant = 'vertical' }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.id);
  const discountPct = product.discountPercentage ?? 0;
  const hasDiscount = discountPct > 0;
  const discountedPrice = hasDiscount ? Math.round(product.price * (1 - discountPct / 100) * 100) / 100 : product.price;
  if (variant === 'horizontal') {
    return (
      <Pressable onPress={onPress} style={styles.hCard}>
        <View style={styles.hImageWrap}>
          <Image source={product.image} style={styles.hImage} contentFit="cover" />
          <View style={styles.hRating}>
            <Text style={styles.hRatingText}>★ {product.rating.toFixed(1)}</Text>
          </View>
          <Pressable
            onPress={() => toggleFavorite(product.id)}
            style={styles.hFavBtn}
            hitSlop={8}
            accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={fav ? colors.error : colors.onPrimary} />
          </Pressable>
        </View>
        <View style={styles.hBody}>
          <View style={styles.hHeader}>
            <Text style={styles.hName} numberOfLines={1}>{product.name}</Text>
            <Text style={styles.hReviews}>({product.reviewCount})</Text>
          </View>
          <Text style={styles.hDesc} numberOfLines={2}>{product.description}</Text>
          <View style={styles.hFooter}>
            <View style={styles.hPriceWrap}>
              <Text style={styles.hPrice}>${discountedPrice.toFixed(2)}</Text>
              {hasDiscount ? <Text style={styles.hPriceOriginal}>${product.price.toFixed(2)}</Text> : null}
            </View>
            {hasDiscount ? (
              <View style={styles.hDiscountTag}>
                <Text style={styles.hDiscountTagText}>-{discountPct}%</Text>
              </View>
            ) : null}
            <Pressable
              onPress={onQuickAdd}
              style={({ pressed }) => [styles.hAddBtn, pressed && styles.hAddBtnPressed]}
              hitSlop={8}
              accessibilityLabel={`Add ${product.name} to cart`}
            >
              <Text style={styles.hAddBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.vCard}>
      <View style={styles.vImageWrap}>
        <Image source={product.image} style={styles.vImage} contentFit="cover" />
        <View style={styles.vRating}>
          <Text style={styles.vRatingText}>★ {product.rating.toFixed(1)}</Text>
        </View>
        <Pressable
          onPress={() => toggleFavorite(product.id)}
          style={styles.vFavBtn}
          hitSlop={8}
          accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={fav ? colors.error : colors.onPrimary} />
        </Pressable>
      </View>
      <View style={styles.vBody}>
        <Text style={styles.vName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.vDesc} numberOfLines={2}>{product.description}</Text>
        <View style={styles.vFooter}>
          <View style={styles.vPriceWrap}>
            <Text style={styles.vPrice}>${discountedPrice.toFixed(2)}</Text>
            {hasDiscount ? <Text style={styles.vPriceOriginal}>${product.price.toFixed(2)}</Text> : null}
          </View>
          {hasDiscount ? (
            <View style={styles.vDiscountTag}>
              <Text style={styles.vDiscountTagText}>-{discountPct}%</Text>
            </View>
          ) : null}
          <Pressable
            onPress={onQuickAdd}
            style={({ pressed }) => [styles.vAddBtn, pressed && styles.vAddBtnPressed]}
            hitSlop={8}
            accessibilityLabel={`Add ${product.name} to cart`}
          >
            <Text style={styles.vAddBtnText}>+</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});


const styles = StyleSheet.create({
  hCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.level1,
    marginBottom: spacing.md,
  },
  hImageWrap: { position: 'relative', width: 96, height: 96, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.surfaceContainer, flexShrink: 0 },
  hImage: { width: '100%', height: '100%' },
  hRating: { position: 'absolute', top: 6, left: 6, backgroundColor: colors.primary + 'BF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.full, flexDirection: 'row', alignItems: 'center', gap: 2 },
  hRatingText: { fontSize: 10, color: colors.onPrimary, fontWeight: '700' },
  hFavBtn: { position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: radii.full, backgroundColor: colors.primary + 'BF', alignItems: 'center', justifyContent: 'center' },
  hBody: { flex: 1, justifyContent: 'space-between', height: 96, paddingVertical: 2 },
  hHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  hName: { flex: 1, fontSize: typography.sizes.bodyMd, fontWeight: '500', color: colors.primary , fontFamily: typography.bodyMedium, lineHeight: 20 },
  hReviews: { fontSize: typography.sizes.labelSm, color: colors.outline , fontFamily: typography.body, lineHeight: 14 },
  hDesc: { fontSize: typography.sizes.bodySm, color: colors.secondary, marginTop: 2 , fontFamily: typography.body, lineHeight: 18 },
  hFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  hPrice: { fontSize: typography.sizes.headlineSm, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  hPriceWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  hPriceOriginal: { fontSize: typography.sizes.labelSm, color: colors.outline, textDecorationLine: 'line-through' , fontFamily: typography.body, lineHeight: 14 },
  hDiscountTag: { backgroundColor: colors.secondaryContainer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.full },
  hDiscountTagText: { fontSize: 10, color: colors.onSecondaryContainer, fontWeight: '700' },
  hAddBtn: { width: 32, height: 32, borderRadius: radii.full, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  hAddBtnPressed: { transform: [{ scale: 0.9 }] },
  hAddBtnText: { color: colors.onPrimary, fontSize: 18, fontWeight: '600', lineHeight: 20 },
  vCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.outlineVariant, overflow: 'hidden', ...shadows.level1 },
  vImageWrap: { position: 'relative', width: '100%', height: 120, backgroundColor: colors.surfaceContainer },
  vImage: { width: '100%', height: '100%' },
  vRating: { position: 'absolute', top: spacing.sm, left: spacing.sm, backgroundColor: colors.surfaceContainerLowest, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.full },
  vRatingText: { fontSize: typography.sizes.labelSm, color: colors.onSurface, fontWeight: '700' , fontFamily: typography.bodyBold, lineHeight: 14 },
  vFavBtn: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 32, height: 32, borderRadius: radii.full, backgroundColor: colors.primary + 'BF', alignItems: 'center', justifyContent: 'center' },
  vBody: { padding: spacing.md },
  vName: { fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.onSurface , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  vDesc: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginTop: 2 , fontFamily: typography.body, lineHeight: 18 },
  vFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  vPrice: { fontSize: typography.sizes.bodyMd, fontWeight: '700', color: colors.primary , fontFamily: typography.bodyBold, lineHeight: 20 },
  vPriceWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  vPriceOriginal: { fontSize: typography.sizes.labelSm, color: colors.outline, textDecorationLine: 'line-through' , fontFamily: typography.body, lineHeight: 14 },
  vDiscountTag: { backgroundColor: colors.secondaryContainer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.full },
  vDiscountTagText: { fontSize: 10, color: colors.onSecondaryContainer, fontWeight: '700' },
  vAddBtn: { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  vAddBtnPressed: { transform: [{ scale: 0.95 }] },
  vAddBtnText: { color: colors.onPrimary, fontSize: 20, fontWeight: '600', lineHeight: 22 },
});
