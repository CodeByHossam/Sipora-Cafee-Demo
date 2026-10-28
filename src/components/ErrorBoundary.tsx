// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '@/constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message };
  }

  componentDidCatch(error: Error, info: unknown) {
    // In production, forward to a monitoring service here.
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ hasError: false, message: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.message ?? 'An unexpected error occurred.'}</Text>
          <Pressable onPress={this.reset} style={styles.btn}>
            <Text style={styles.btnText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.surface },
  title: { fontSize: typography.sizes.headlineMd, fontWeight: '600', color: colors.primary, marginBottom: spacing.sm , fontFamily: typography.headlineSemiBold, lineHeight: 28 },
  message: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.lg , fontFamily: typography.body, lineHeight: 20 },
  btn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full, backgroundColor: colors.primaryContainer },
  btnText: { color: colors.onPrimary, fontWeight: '600' },
});