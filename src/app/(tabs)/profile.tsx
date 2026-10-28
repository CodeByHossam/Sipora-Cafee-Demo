import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import { useFavorites } from '@/hooks/useFavorites';
import { useUser } from '@/hooks/useUser';

interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { count: favCount } = useFavorites();
  const { user, logout } = useUser();

  if (!user.isLoggedIn) {
    return (
      <View style={styles.guestContainer}>
        <Ionicons name="person-circle-outline" size={72} color={colors.outline} />
        <Text style={styles.guestTitle}>You are browsing as a guest</Text>
        <Text style={styles.guestSub}>Sign in to track your points, favorites, and order history.</Text>
        <Pressable style={styles.guestBtn} onPress={() => router.push('/login')} accessibilityLabel="Sign in">
          <Text style={styles.guestBtnText}>Sign in</Text>
        </Pressable>
        <Pressable style={styles.guestBtnSecondary} onPress={() => router.push('/signup')} accessibilityLabel="Create account">
          <Text style={styles.guestBtnSecondaryText}>Create account</Text>
        </Pressable>
      </View>
    );
  }


  const menuItems: MenuItem[] = [
    { id: 'favorites', icon: 'heart-outline', label: 'My Favorites', subtitle: 'Saved drinks' },
    { id: 'orders', icon: 'receipt-outline', label: 'Order History', subtitle: 'Past orders' },
    { id: 'payments', icon: 'card-outline', label: 'Payment Methods', subtitle: 'Cards & wallets' },
    { id: 'notifications', icon: 'notifications-outline', label: 'Notifications', subtitle: 'Order updates' },
    { id: 'help', icon: 'help-circle-outline', label: 'Help & Support', subtitle: 'FAQs & contact' },
    { id: 'about', icon: 'information-circle-outline', label: 'About Sipora', subtitle: 'Version 1.0.0' },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {user.image ? (
              <Image source={user.image} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Ionicons name="person" size={40} color={colors.onPrimary} />
            )}
          </View>
          <Pressable style={styles.editBtn} accessibilityLabel="Edit profile">
            <Ionicons name="pencil" size={14} color={colors.onPrimary} />
          </Pressable>
        </View>
        <Text style={styles.name}>{user.userName}</Text>
        <Text style={styles.email}>{user.role === 'admin' ? 'Administrator' : 'Member'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{favCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        {menuItems.map((item, idx) => (
          <Pressable
            key={item.id}
            style={[styles.menuRow, idx < menuItems.length - 1 && styles.menuRowBorder]}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={() => {
              if (item.id === 'favorites') router.push('/favorites');
            }}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon} size={20} color={colors.secondary} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.subtitle ? <Text style={styles.menuSub}>{item.subtitle}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.outline} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutBtn} onPress={logout} accessibilityRole="button" accessibilityLabel="Log out">
        <Ionicons name="log-out-outline" size={18} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { paddingHorizontal: spacing.marginMobile, paddingTop: spacing.md },
  header: { alignItems: 'center', paddingVertical: spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: spacing.md },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  name: { fontSize: typography.sizes.headlineMd, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 28 },
  email: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, marginTop: 2 , fontFamily: typography.body, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  statValue: { fontSize: typography.sizes.headlineMd, fontWeight: '700', color: colors.primary , fontFamily: typography.headlineBold, lineHeight: 28 },
  statLabel: { fontSize: typography.sizes.labelSm, color: colors.onSurfaceVariant, marginTop: 2 , fontFamily: typography.body, lineHeight: 14 },
  menuCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.level1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    minHeight: 56,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.onSurface , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  menuSub: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginTop: 2 , fontFamily: typography.body, lineHeight: 18 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.errorContainer,
    backgroundColor: colors.errorContainer,
  },
  logoutText: { fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.error , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  guestContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl, backgroundColor: colors.surface },
  guestTitle: { fontSize: typography.sizes.headlineSm, fontWeight: '600', color: colors.primary, textAlign: 'center' , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  guestSub: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center' , fontFamily: typography.body, lineHeight: 20 },
  guestBtn: { width: '100%', height: 48, borderRadius: radii.full, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  guestBtnText: { color: colors.onPrimary, fontSize: typography.sizes.labelLg, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  guestBtnSecondary: { width: '100%', height: 48, borderRadius: radii.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  guestBtnSecondaryText: { color: colors.primary, fontSize: typography.sizes.labelLg, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 20 },
});
