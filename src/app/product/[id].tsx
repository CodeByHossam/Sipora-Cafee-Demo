import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { getProductById } from '@/data/homeProducts';

const OptionGroup = ({
  title,
  icon,
  options,
  selected,
  onSelect,
  required = false,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  options: { id: string; label: string; priceDelta: number }[];
  selected: string;
  onSelect: (id: string) => void;
  required?: boolean;
}) => (
  <View style={styles.group}>
    <View style={styles.groupHeader}>
      <View style={styles.groupTitleRow}>
        <Ionicons name={icon} size={20} color={colors.secondary} />
        <Text style={styles.groupTitle}>{title}</Text>
      </View>
      <Text style={styles.groupBadge}>{required ? 'Required' : 'Choose 1'}</Text>
    </View>
    <View style={styles.optionsRow}>
      {options.map((o) => {
        const active = selected === o.id;
        return (
          <Pressable key={o.id} onPress={() => onSelect(o.id)} style={[styles.option, active && styles.optionActive]}>
            <Text style={[styles.optionText, active && styles.optionTextActive]}>{o.label}</Text>
            {o.priceDelta > 0 ? (
              <Text style={[styles.optionDelta, active && styles.optionDeltaActive]}>+${o.priceDelta.toFixed(2)}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  </View>
);

export default function DrinkDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const safeBack = useSafeBack();
  const product = getProductById(id ?? '');

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [sizeId, setSizeId] = useState(product?.customizations.sizes[0]?.id ?? '');
  const [milkId, setMilkId] = useState(product?.customizations.milks[0]?.id ?? '');
  const [shotId, setShotId] = useState(product?.customizations.shots[0]?.id ?? '');
  const [sweetId, setSweetId] = useState(product?.customizations.sweetness[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const isFav = product ? isFavorite(product.id) : false;

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Drink not found</Text>
        <Pressable onPress={safeBack} style={styles.backBtn}>
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const size = product.customizations.sizes.find((o) => o.id === sizeId) ?? product.customizations.sizes[0];
  const milk = product.customizations.milks.find((o) => o.id === milkId) ?? product.customizations.milks[0];
  const shot = product.customizations.shots.find((o) => o.id === shotId) ?? product.customizations.shots[0];
  const sweet = product.customizations.sweetness.find((o) => o.id === sweetId) ?? product.customizations.sweetness[0];

  const unitPrice =
    product.price + (size?.priceDelta ?? 0) + (milk?.priceDelta ?? 0) + (shot?.priceDelta ?? 0) + (sweet?.priceDelta ?? 0);
  const total = unitPrice * qty;

  const handleAddToCart = () => {
    addItem(product, { size: sizeId, milk: milkId, shot: shotId, sweet: sweetId }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };


  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.utilityBar}>
          <Pressable onPress={safeBack} style={styles.iconBtn} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </Pressable>
          <View style={styles.categoryPill}>
            <Ionicons name="cafe-outline" size={14} color={colors.secondary} />
            <Text style={styles.categoryText}>Specialty Pour</Text>
          </View>
          <Pressable onPress={() => product && toggleFavorite(product.id)} style={styles.iconBtn} accessibilityLabel="Favorite drink">
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? colors.error : colors.secondary} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Image source={product.image} style={styles.heroImage} contentFit="cover" />
          <View style={styles.steamBadge}>
            <Ionicons name="water" size={12} color={colors.onTertiaryContainer} />
            <Text style={styles.steamText}>Freshly Steamed</Text>
          </View>
          <View style={styles.roastBadge}>
            <Text style={styles.roastText}>Medium Roast • House Blend</Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.metricsRow}>
            <Ionicons name="star" size={16} color={colors.onTertiaryContainer} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({product.reviewCount} reviews)</Text>
            <Text style={styles.priceTag}>${product.price.toFixed(2)}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
          {product.tastingNotes.split(',').map((note) => (
            <View key={note.trim()} style={styles.flavorChip}>
              <View style={styles.flavorDot} />
              <Text style={styles.flavorChipText}>{note.trim()}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.description}>{product.description}</Text>

        <OptionGroup title="Size" icon="resize-outline" options={product.customizations.sizes} selected={sizeId} onSelect={setSizeId} required />
        <OptionGroup title="Milk" icon="water-outline" options={product.customizations.milks} selected={milkId} onSelect={setMilkId} />
        <OptionGroup title="Espresso shots" icon="cafe-outline" options={product.customizations.shots} selected={shotId} onSelect={setShotId} />
        <OptionGroup title="Sweetness" icon="sparkles-outline" options={product.customizations.sweetness} selected={sweetId} onSelect={setSweetId} />

        <View style={styles.baristaNote}>
          <View style={styles.baristaAvatar}>
            <Ionicons name="person" size={18} color={colors.onPrimary} />
          </View>
          <View style={styles.baristaBody}>
            <Text style={styles.baristaLabel}>Barista&apos;s Note</Text>
            <Text style={styles.baristaText}>
              &ldquo;Our baristas recommend oat milk for a creamier texture with this roast.&rdquo;
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.checkoutBar}>
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.qtyStepper}>
          <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.qtyBtn}>
            <Ionicons name="remove" size={18} color={colors.primary} />
          </Pressable>
          <Text style={styles.qtyValue}>{qty}</Text>
          <Pressable onPress={() => setQty((q) => q + 1)} style={styles.qtyBtn}>
            <Ionicons name="add" size={18} color={colors.primary} />
          </Pressable>
        </View>
        <Pressable onPress={handleAddToCart} style={[styles.addToCartBtn, added && styles.addToCartBtnSuccess]}>
          {added ? (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.onPrimary} />
              <Text style={styles.addToCartText}>Added to Order</Text>
            </>
          ) : (
            <>
              <Ionicons name="bag-add-outline" size={20} color={colors.onPrimary} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.marginMobile, paddingTop: spacing.sm },
  container: { flex: 1, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: typography.sizes.headlineXlMobile, color: colors.primary, fontWeight: '600' , fontFamily: typography.headlineSemiBold, lineHeight: 36 },
  backBtn: { marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.primaryContainer, borderRadius: radii.full },
  backText: { color: colors.onPrimary, fontWeight: '600' },
  utilityBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  categoryText: { fontSize: typography.sizes.labelMd, color: colors.secondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  hero: { borderRadius: radii.xl, overflow: 'hidden', height: 288, backgroundColor: colors.surfaceContainer, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  titleBlock: { marginTop: spacing.lg },
  productName: { fontSize: typography.sizes.headlineLg, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 32 },
  metricsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  rating: { fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.onSurface , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  reviews: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 18 },
  priceTag: { marginLeft: 'auto', fontSize: typography.sizes.bodyLg, fontWeight: '700', color: colors.primary , fontFamily: typography.bodyBold, lineHeight: 24 },
  chipsScroll: { marginTop: spacing.md },
  chipsContent: { gap: spacing.sm },
  description: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, lineHeight: 20, marginTop: spacing.md , fontFamily: typography.body },
  group: { marginTop: spacing.lg },
  groupTitle: { fontSize: typography.sizes.labelLg, color: colors.onSurface, fontWeight: '600', marginBottom: spacing.sm , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  optionActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  optionText: { fontSize: typography.sizes.labelMd, color: colors.onSurface, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  optionTextActive: { color: colors.onPrimary },
  optionDelta: { fontSize: typography.sizes.labelSm, color: colors.secondary, marginTop: 2 , fontFamily: typography.body, lineHeight: 14 },
  optionDeltaActive: { color: colors.onPrimaryContainer },
  baristaNote: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginTop: spacing.lg,
    alignItems: 'flex-start',
  },
  baristaNoteText: { flex: 1, fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, lineHeight: 18 , fontFamily: typography.body },
  checkoutBar: {
    position: 'absolute',
    left: spacing.marginMobile,
    right: spacing.marginMobile,
    bottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level2,
  },
  qtyBtn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { minWidth: 28, textAlign: 'center', fontSize: typography.sizes.bodyMd, fontWeight: '700', color: colors.primary , fontFamily: typography.bodyBold, lineHeight: 20 },
  addToCartBtn: {
    flex: 1,
    height: 48,
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.level2,
  },
  addToCartText: { color: colors.onPrimary, fontSize: typography.sizes.labelLg, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  addToCartBtnSuccess: { backgroundColor: colors.secondary },

  steamBadge: { position: 'absolute', top: spacing.md, left: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface + 'E6', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.full },
  steamText: { fontSize: typography.sizes.labelSm, color: colors.primary, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 14 },
  roastBadge: { position: 'absolute', top: spacing.md, right: spacing.md, backgroundColor: colors.tertiaryContainer, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.full },
  roastText: { fontSize: typography.sizes.labelSm, color: colors.onTertiaryContainer, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 14 },

  groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  groupTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  groupBadge: { fontSize: typography.sizes.labelSm, color: colors.onSurfaceVariant, backgroundColor: colors.secondaryContainer + '66', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.full , fontFamily: typography.body, lineHeight: 14 },

  flavorChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.caramel + '1F', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  flavorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.onTertiaryContainer },
  flavorChipText: { fontSize: typography.sizes.labelMd, color: colors.caramel, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },

  baristaAvatar: { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  baristaBody: { flex: 1 },
  baristaLabel: { fontSize: typography.sizes.labelMd, color: colors.primary, fontWeight: '700', marginBottom: 2 , fontFamily: typography.bodyBold, lineHeight: 16 },
  baristaText: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, lineHeight: 18, fontStyle: 'italic' , fontFamily: typography.body },

  priceBlock: { paddingHorizontal: spacing.xs },
  priceLabel: { fontSize: typography.sizes.labelSm, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 14 },
  priceValue: { fontSize: typography.sizes.headlineSm, fontWeight: '700', color: colors.primary , fontFamily: typography.headlineBold, lineHeight: 24 },
});
