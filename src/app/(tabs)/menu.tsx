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
import { CATALOG } from '@/data/catalog';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/features/ProductCard';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'hot', label: 'Hot' },
  { id: 'iced', label: 'Iced' },
  { id: 'pastries', label: 'Pastries' },
];

export default function MenuScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = CATALOG.filter((p) => {
    const matchesCat = tab === 'all' || p.category === tab;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product, { size: product.customizations.sizes[0].id, milk: product.customizations.milks[0].id, shot: product.customizations.shots[0].id, sweet: product.customizations.sweetness[0].id }, 1);
    showToast(`${product.name} added`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Explore our menu</Text>
            <Text style={styles.subtitle}>Crafted with ethically sourced beans and artisanal care.</Text>
          </View>
          <View style={styles.freshBadge}>
            <View style={styles.freshDot} />
            <Text style={styles.freshText}>Fresh Roast</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search roast, blend, or pastry..."
              placeholderTextColor={colors.outline}
              value={query}
              onChangeText={(t) => setQuery(t.slice(0, 80))}
              accessibilityLabel="Search menu"
            />
          </View>
          <Pressable style={styles.filterBtn} accessibilityLabel="Filter options">
            <Ionicons name="options-outline" size={20} color={colors.onSurface} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContent}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={[styles.tab, active && styles.tabActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.featuredCard}>
          <View style={styles.featuredBody}>
            <Text style={styles.featuredKicker}>Seasonal Curator</Text>
            <Text style={styles.featuredTitle}>Spiced Caramel Cloud</Text>
            <Text style={styles.featuredSub}>Limited release — warm spice, caramel cloud foam.</Text>
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No items match your search.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} onQuickAdd={() => handleQuickAdd(item)} />
            </View>
          )}
        />

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.marginMobile, paddingTop: spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md, gap: spacing.sm },
  title: { fontSize: typography.sizes.headlineLg, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 32 },
  subtitle: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, marginTop: 2 , fontFamily: typography.body, lineHeight: 20 },
  freshBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  freshDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.secondary },
  freshText: { fontSize: typography.sizes.labelSm, color: colors.onSecondaryContainer, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 14 },
  searchRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    ...shadows.level1,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, fontSize: typography.sizes.bodyMd, color: colors.onSurface , fontFamily: typography.body, lineHeight: 20 },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.level1,
  },
  tabsScroll: { marginBottom: spacing.md },
  tabsContent: { gap: spacing.sm },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  tabActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  tabText: { fontSize: typography.sizes.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  tabTextActive: { color: colors.onPrimary },
  featuredCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.level1,
  },
  featuredBody: { gap: 2 },
  featuredKicker: { fontSize: typography.sizes.labelSm, color: colors.onPrimaryContainer, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 , fontFamily: typography.bodyBold, lineHeight: 14 },
  featuredTitle: { fontSize: typography.sizes.headlineMd, color: colors.onPrimary, fontWeight: '600', marginTop: 2 , fontFamily: typography.headlineSemiBold, lineHeight: 28 },
  featuredSub: { fontSize: typography.sizes.bodySm, color: colors.onPrimary, opacity: 0.9, marginTop: 2 , fontFamily: typography.body, lineHeight: 18 },
  gridRow: { gap: spacing.md, marginBottom: spacing.md },
  gridItem: { flex: 1 },
  empty: { textAlign: 'center', color: colors.onSurfaceVariant, fontSize: typography.sizes.bodyMd, paddingVertical: spacing.xl , fontFamily: typography.body, lineHeight: 20 },
  toast: {
    position: 'absolute',
    bottom: 90,
    left: spacing.marginMobile,
    right: spacing.marginMobile,
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    ...shadows.level2,
  },
  toastText: { color: colors.onPrimary, fontSize: typography.sizes.labelMd, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
});
