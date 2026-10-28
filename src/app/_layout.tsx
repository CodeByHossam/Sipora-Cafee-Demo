import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Platform, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import {
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { CartProvider } from '@/hooks/useCart';
import { FavoritesProvider } from '@/hooks/useFavorites';
import { PointsProvider } from '@/hooks/usePoints';
import { UserProvider } from '@/hooks/useUser';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { colors } from '@/constants/theme';

function WebFocusReset() {
  const pathname = usePathname();
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc = (globalThis as any).document;
    const active = doc?.activeElement as HTMLElement | null;
    if (active && typeof active.blur === 'function') {
      active.blur();
    }
  }, [pathname]);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <WebFocusReset />
      <UserProvider>
      <CartProvider>
        <FavoritesProvider>
          <PointsProvider>
            <StatusBar style="dark" />
            <View style={styles.outerContainer}>
              <View style={styles.innerContainer}>
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="product/[id]" />
                  <Stack.Screen name="favorites" />
                  <Stack.Screen name="signup" />
                  <Stack.Screen name="login" />
                </Stack>
              </View>
            </View>
          </PointsProvider>
        </FavoritesProvider>
      </CartProvider>
    </UserProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surface,
    ...Platform.select({
      web: {
        boxShadow: '0px 0px 20px rgba(0,0,0,0.3)',
      },
    }),
  },
});
