import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeBack } from '@/hooks/useSafeBack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { textStyles } from '@/theme/typography';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';

export default function SignupScreen() {
  const router = useRouter();
  const safeBack = useSafeBack();
  const insets = useSafeAreaInsets();
  const { login } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    login(name.trim());
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl }]} showsVerticalScrollIndicator={false}>
      <Pressable onPress={safeBack} style={styles.backBtn} accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </Pressable>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="cafe" size={32} color={colors.onPrimary} />
        </View>
        <Text style={[styles.welcome, textStyles.screenTitle]}>{'We are happy to have you!'}</Text>
        <Text style={styles.subtitle}>Create your account and start earning rewards on every sip.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} placeholder="Elena Rossi" placeholderTextColor={colors.outline} value={name} onChangeText={setName} accessibilityLabel="Full name" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={colors.outline} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" accessibilityLabel="Email" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.outline} value={password} onChangeText={setPassword} secureTextEntry accessibilityLabel="Password" />

        <Pressable style={styles.submitBtn} onPress={handleSignup} accessibilityLabel="Create account">
          <Text style={styles.submitText}>Create account</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>
      </View>

      <View style={styles.loyaltyCard}>
        <Text style={styles.loyaltyTitle}>Sipora Rewards</Text>
        <Text style={styles.loyaltySub}>Earn points with every purchase and unlock free drinks.</Text>
        <View style={styles.loyaltyRow}>
          <View style={styles.loyaltyIcon}>
            <Ionicons name="cafe-outline" size={22} color={colors.onPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.loyaltyRowTitle}>Buy any drink</Text>
            <Text style={styles.loyaltyRowSub}>+5 points per drink</Text>
          </View>
        </View>
        <View style={styles.loyaltyRow}>
          <View style={styles.loyaltyIcon}>
            <Ionicons name="gift-outline" size={22} color={colors.onPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.loyaltyRowTitle}>Reach 50 points</Text>
            <Text style={styles.loyaltyRowSub}>1 FREE drink of your choice</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipBtn} accessibilityLabel="Continue as guest">
        <Text style={styles.skipText}>Continue as guest</Text>
      </Pressable>
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
  loyaltyCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: radii.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.outlineVariant },
  loyaltyTitle: { fontSize: typography.sizes.headlineSm, fontWeight: '600', color: colors.primary, marginBottom: spacing.xs , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  loyaltySub: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginBottom: spacing.md , fontFamily: typography.body, lineHeight: 18 },
  loyaltyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  loyaltyIcon: { width: 44, height: 44, borderRadius: radii.lg, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  loyaltyRowTitle: { fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.onSurface , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  loyaltyRowSub: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginTop: 2 , fontFamily: typography.body, lineHeight: 18 },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.md },
  skipText: { fontSize: typography.sizes.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
});

