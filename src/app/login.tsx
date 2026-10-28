import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeBack } from '@/hooks/useSafeBack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { authenticate, USERS } from '@/data/users';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const safeBack = useSafeBack();
  const insets = useSafeAreaInsets();
  const { loginAs } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const found = authenticate(email, password);
    if (!found) {
      Alert.alert('Login failed', 'Invalid email or password.');
      return;
    }
    loginAs(found);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl }]} showsVerticalScrollIndicator={false}>
      <Pressable onPress={safeBack} style={styles.backBtn} accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </Pressable>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="person" size={32} color={colors.onPrimary} />
        </View>
        <Text style={styles.welcome}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to access your rewards and order history.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={colors.outline} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" accessibilityLabel="Email" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.outline} value={password} onChangeText={setPassword} secureTextEntry accessibilityLabel="Password" />

        <Pressable style={styles.submitBtn} onPress={handleLogin} accessibilityLabel="Log in">
          <Text style={styles.submitText}>Log in</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>
      </View>

      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>Demo accounts</Text>
        {USERS.map((u) => (
          <View key={u.id} style={styles.demoRow}>
            <Text style={styles.demoRole}>{u.role}</Text>
            <Text style={styles.demoCred}>{u.email} / {u.password}</Text>
          </View>
        ))}
      </View>

      <View style={styles.linkRow}>
        <Text style={styles.linkText}>No account yet?</Text>
        <Pressable onPress={() => router.push('/signup')} accessibilityLabel="Go to signup">
          <Text style={styles.linkAction}>Sign up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { paddingHorizontal: spacing.marginMobile },
  backBtn: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  heroIcon: { width: 72, height: 72, borderRadius: radii.full, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, ...shadows.level2 },
  welcome: { fontSize: typography.sizes.headlineLg, fontWeight: '600', color: colors.primary, textAlign: 'center' , fontFamily: typography.headlineSemiBold, lineHeight: 32 },
  subtitle: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs , fontFamily: typography.body, lineHeight: 20 },
  card: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radii.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.outlineVariant, ...shadows.level1 },
  label: { fontSize: typography.sizes.labelMd, color: colors.onSurface, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.sm , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  input: { height: 48, backgroundColor: colors.surfaceContainerLow, borderRadius: radii.lg, paddingHorizontal: spacing.md, fontSize: typography.sizes.bodyMd, color: colors.onSurface, borderWidth: 1, borderColor: colors.outlineVariant , fontFamily: typography.body, lineHeight: 20 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, height: 52, borderRadius: radii.full, backgroundColor: colors.primaryContainer, marginTop: spacing.lg, ...shadows.level2 },
  submitText: { color: colors.onPrimary, fontSize: typography.sizes.labelLg, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  demoCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: radii.lg, padding: spacing.md, marginBottom: spacing.lg },
  demoTitle: { fontSize: typography.sizes.labelMd, fontWeight: '700', color: colors.primary, marginBottom: spacing.sm , fontFamily: typography.bodyBold, lineHeight: 16 },
  demoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, gap: spacing.sm },
  demoRole: { fontSize: typography.sizes.labelSm, color: colors.onSurfaceVariant, fontWeight: '600', textTransform: 'capitalize' , fontFamily: typography.bodySemiBold, lineHeight: 14 },
  demoCred: { fontSize: typography.sizes.labelSm, color: colors.onSurface , fontFamily: typography.body, lineHeight: 14 },
  linkRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  linkText: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 20 },
  linkAction: { fontSize: typography.sizes.bodyMd, color: colors.primary, fontWeight: '700' , fontFamily: typography.bodyBold, lineHeight: 20 },
});