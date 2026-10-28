import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import {
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
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
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="product/[id]" />
              <Stack.Screen name="favorites" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="login" />
            </Stack>
          </PointsProvider>
        </FavoritesProvider>
      </CartProvider>
    </UserProvider>
    </ErrorBoundary>
  );
}
