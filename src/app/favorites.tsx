import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography } from '@/constants/theme';
import { useFavorites } from '@/hooks/useFavorites';
import { ProductCard } from '@/components/features/ProductCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const safeBack = useSafeBack();
  const insets = useSafeAreaInsets();
  const { favoriteProducts, removeFavorite, count } = useFavorites();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={safeBack} style={styles.backBtn} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>My Favorites</Text>
        <View style={{ width: 40 }} />
      </View>

      {favoriteProducts.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color={colors.outline} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySub}>Tap the heart on a drink to save it here.</Text>
          <Pressable style={styles.browseBtn} onPress={() => router.replace('/(tabs)/menu')} accessibilityLabel="Browse menu">
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <ProductCard
                product={item}
                variant="horizontal"
                onPress={() => router.push(`/product/${item.id}`)}
              />
              <Pressable
                onPress={() => removeFavorite(item.id)}
                style={styles.removeBtn}
                accessibilityLabel={`Remove ${item.name} from favorites`}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </Pressable>
            </View>
          )}
          ListHeaderComponent={
            <Text style={styles.count}>{count} saved drink{count === 1 ? '' : 's'}</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full },
  title: { fontSize: typography.sizes.headlineMd, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 28 },
  list: { paddingHorizontal: spacing.marginMobile, paddingTop: spacing.md },
  count: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginBottom: spacing.md , fontFamily: typography.body, lineHeight: 18 },
  cardWrap: { position: 'relative' },
  removeBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  emptyTitle: { fontSize: typography.sizes.headlineSm, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  emptySub: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center' , fontFamily: typography.body, lineHeight: 20 },
  browseBtn: { marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, backgroundColor: colors.primaryContainer },
  browseBtnText: { color: colors.onPrimary, fontSize: typography.sizes.labelLg, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 20 },
});