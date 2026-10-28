import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { colors, spacing } from '@/constants/theme';

export default function TabsLayout() {
  const { itemCount } = useCart();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(spacing.sm, insets.bottom);
  const isAuthed = user.isLoggedIn;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.outlineVariant,
          height: 64 + bottomPad,
          paddingBottom: bottomPad,
          paddingTop: spacing.sm,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <Ionicons name="cafe-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="bag-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthed ? 'Profile' : 'Sign in',
          href: isAuthed ? '/(tabs)/profile' : '/login',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={isAuthed ? 'person-outline' : 'log-in-outline'} size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}