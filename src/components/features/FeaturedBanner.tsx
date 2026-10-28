import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';

interface FeaturedBannerProps {
  badge?: string | null;
  title: string;
  subtitle: string;
  cta?: string;
  image?: number;
  onPress?: () => void;
}

export function FeaturedBanner({
  badge = '20% OFF TODAY',
  title,
  subtitle,
  cta = 'Try Now',
  image,
  onPress,
}: FeaturedBannerProps) {
  const photo = image ?? require('@/assets/images/products/caramel-latte.png');
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.left}>
        {badge ? (
          <View style={styles.badge}>
            <Ionicons name="pricetag-outline" size={13} color={colors.onSecondaryContainer} />
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
        <Pressable onPress={onPress} style={styles.cta}>
          <Text style={styles.ctaText}>{cta}</Text>
          <Ionicons name="arrow-forward" size={15} color={colors.primary} />
        </Pressable>
      </View>
      <View style={styles.photoWrap}>
        <ExpoImage source={photo} style={styles.photo} contentFit="cover" />
        <View style={styles.photoGradient} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.primaryContainer,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 200,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.level1,
  },
  left: {
    flex: 1,
    minWidth: '55%',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  badgeText: {
    fontSize: typography.sizes.labelSm, fontFamily: typography.body, lineHeight: 14,    color: colors.onSecondaryContainer,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: typography.sizes.bodySm,
    fontFamily: typography.body,
    lineHeight: 18,
    color: colors.outlineVariant,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.surfaceBright,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    marginTop: spacing.sm,
  },
  ctaText: {
    fontSize: typography.sizes.labelMd, fontFamily: typography.body, lineHeight: 16,    color: colors.primary,
    fontWeight: '600',
  },
  photoWrap: {
    width: 120,
    borderRadius: radii.lg,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  photo: {
    width: '100%',
    height: 152,
  },
  photoGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(59,36,28,0.3)',
  },
});
