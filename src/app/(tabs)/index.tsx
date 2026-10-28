import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { HOME_PRODUCTS, getHeroProduct } from '@/data/homeProducts';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/features/ProductCard';
import { FeaturedBanner } from '@/components/features/FeaturedBanner';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'hot', label: 'Espresso', icon: 'cafe-outline' },
  { id: 'iced', label: 'Cold Brew', icon: 'snow-outline' },
  { id: 'pastries', label: 'Pastries', icon: 'restaurant-outline' },
  { id: 'tea', label: 'Artisanal Tea', icon: 'leaf-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = HOME_PRODUCTS.filter((p) => {
    const matchesCat = category === 'all' || p.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const hero = getHeroProduct();

  const handleQuickAdd = (product: Product) => {
    addItem(product, { size: product.customizations.sizes[0].id, milk: product.customizations.milks[0].id, shot: product.customizations.shots[0].id, sweet: product.customizations.sweetness[0].id }, 1);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.greeting}>
        <View style={{ flex: 1 }}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingTitle}>{user.isLoggedIn && user.userName ? `Good morning, ${user.userName}` : 'Hello, coffee lover'}</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>
          <Text style={styles.greetingSub}>Every sip, a little moment of joy.</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="cafe" size={20} color={colors.primary} />
        </View>
      </View>

      {!user.isLoggedIn ? (
        <>
          <Pressable style={styles.guestCta} onPress={() => router.push('/signup')} accessibilityLabel="Join rewards program">
            <Ionicons name="gift-outline" size={20} color={colors.onPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guestCtaTitle}>Join our rewards program</Text>
              <Text style={styles.guestCtaSub}>Get free drinks and earn 5 points per purchase. Sign up now.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.onPrimary} />
          </Pressable>
          <Pressable onPress={() => router.push('/login')} style={styles.loginLink} accessibilityLabel="Log in">
            <Text style={styles.loginLinkText}>Already a member? Log in</Text>
          </Pressable>
        </>
      ) : null}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search handcrafted coffee, pastries..."
            placeholderTextColor={colors.outline}
            value={query}
            onChangeText={(t) => setQuery(t.slice(0, 80))}
            accessibilityLabel="Search drinks and pastries"
          />
        </View>
        <Pressable style={styles.filterBtn} accessibilityLabel="Filter options">
          <Ionicons name="options-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>

      {hero ? (
        <FeaturedBanner
          title={hero.name}
          subtitle={hero.description}
          cta="Try Now"
          image={hero.image as number}
          badge={hero.discountPercentage && hero.discountPercentage > 0 ? `${hero.discountPercentage}% OFF TODAY` : null}
          onPress={() => {}}
        />
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
        {CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Filter by ${c.label}`}
            >
              <Ionicons name={c.icon as any} size={16} color={active ? colors.onPrimary : colors.secondary} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Popular Choices</Text>
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>Top 3</Text>
          </View>
        </View>
        <Pressable style={styles.viewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.onTertiaryContainer} />
        </Pressable>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <ProductCard product={item} variant="horizontal" onPress={() => router.push(`/product/${item.id}`)} onQuickAdd={() => handleQuickAdd(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No drinks match your search.</Text>
        }
      />


      <View style={[styles.roasterCard, shadows.level1]}>
        <View style={styles.roasterHeader}>
          <View style={styles.roasterIcon}>
            <Ionicons name="leaf-outline" size={22} color={colors.onSecondaryContainer} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.roasterKicker}>Today&apos;s Roaster Pick</Text>
            <Text style={styles.roasterTitle}>Ethiopia Yirgacheffe</Text>
          </View>
          <View style={styles.microLot}>
            <Text style={styles.microLotText}>Micro-Lot</Text>
          </View>
        </View>
        <View style={styles.roasterBody}>
          <Ionicons name="options-outline" size={16} color={colors.secondary} />
          <Text style={styles.roasterProfileLabel}>Tasting Profile:</Text>
        </View>
        <Text style={styles.roasterProfile}>
          Floral jasmine, delicate bergamot zest & raw wildflower honey notes. Roasted yesterday morning.
        </Text>
        <View style={styles.roasterFooter}>
          <View style={styles.brewingDot} />
          <Text style={styles.brewingText}>Brewing fresh in bar</Text>
          <Pressable style={styles.orderBtn}>
            <Text style={styles.orderBtnText}>Order Pour Over</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.onPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { paddingHorizontal: spacing.marginMobile, paddingTop: spacing.md },
  greeting: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greetingTitle: { fontSize: typography.sizes.headlineXlMobile, color: colors.primary, fontFamily: 'PlayfairDisplay_700Bold', lineHeight: typography.lineHeights.headlineXlMobile },
  sparkle: { fontSize: 18 },
  greetingSub: { fontSize: typography.sizes.bodyMd, color: colors.secondary, marginTop: 2 , fontFamily: typography.body, lineHeight: 20 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    height: 48,
    ...shadows.level1,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, fontSize: typography.sizes.bodyMd, color: colors.onSurface , fontFamily: typography.body, lineHeight: 20 },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.level1,
  },
  chipsScroll: { marginBottom: spacing.lg },
  chipsContent: { gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  chipText: { fontSize: typography.sizes.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  chipTextActive: { color: colors.onPrimary },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { fontSize: typography.sizes.headlineSm, fontWeight: '600', color: colors.primary, letterSpacing: -0.01 , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  topBadge: { backgroundColor: colors.secondaryContainer, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.full },
  topBadgeText: { fontSize: typography.sizes.labelSm, color: colors.onSecondaryContainer, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 14 },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: typography.sizes.labelMd, color: colors.onTertiaryContainer, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  sectionTitle2: { fontSize: typography.sizes.headlineSm, fontWeight: '500', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  roasterCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  roasterHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  roasterIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roasterKicker: { fontSize: typography.sizes.labelSm, color: colors.onTertiaryContainer, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 , fontFamily: typography.bodyBold, lineHeight: 14 },
  roasterTitle: { fontSize: typography.sizes.headlineSm, color: colors.primary, fontWeight: '600', marginTop: 2 , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  microLot: { backgroundColor: colors.surfaceContainerLowest, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.full },
  microLotText: { fontSize: typography.sizes.labelSm, color: colors.primary, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 14 },
  roasterBody: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  roasterProfileLabel: { fontSize: typography.sizes.labelMd, color: colors.secondary, fontWeight: '500' , fontFamily: typography.bodyMedium, lineHeight: 16 },
  roasterProfile: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginTop: 4 , fontFamily: typography.body, lineHeight: 18 },
  roasterFooter: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  brewingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.onTertiaryContainer },
  brewingText: { flex: 1, fontSize: typography.sizes.labelSm, color: colors.secondary , fontFamily: typography.body, lineHeight: 14 },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  orderBtnText: { color: colors.onPrimary, fontSize: typography.sizes.labelSm, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 14 },
  emptyText: { textAlign: 'center', color: colors.onSurfaceVariant, fontSize: typography.sizes.bodyMd, paddingVertical: spacing.xl , fontFamily: typography.body, lineHeight: 20 },
  guestCta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primaryContainer, padding: spacing.md, borderRadius: radii.xl, marginBottom: spacing.sm, ...shadows.level1 },
  guestCtaTitle: { fontSize: typography.sizes.bodyMd, fontWeight: '700', color: colors.onPrimary , fontFamily: typography.bodyBold, lineHeight: 20 },
  guestCtaSub: { fontSize: typography.sizes.bodySm, color: colors.onPrimary, opacity: 0.9, marginTop: 2 , fontFamily: typography.body, lineHeight: 18 },
  loginLink: { alignItems: 'center', paddingVertical: spacing.sm, marginBottom: spacing.lg },
  loginLinkText: { fontSize: typography.sizes.labelMd, color: colors.primary, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
});
