// src/app/+not-found.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { colors, spacing, radii, typography } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.sub}>The screen you&apos;re looking for doesn&apos;t exist.</Text>
        <Link href="/" asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Go home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.surface },
  code: { fontSize: 64, fontWeight: '700', color: colors.primaryContainer },
  title: { fontSize: typography.sizes.headlineMd, fontWeight: '600', color: colors.primary, marginTop: spacing.sm , fontFamily: typography.headlineSemiBold, lineHeight: 28 },
  sub: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.xs, marginBottom: spacing.lg , fontFamily: typography.body, lineHeight: 20 },
  btn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, backgroundColor: colors.primaryContainer },
  btnText: { color: colors.onPrimary, fontWeight: '600' },
});