// src/theme/typography.ts
// Centralized typography styles for the Sipora Cafe app.
// Fonts: Fraunces (headings) + Inter (body/UI).
import { TextStyle } from 'react-native';
import { colors } from '@/constants/theme';

const F = {
  fraunces: 'Fraunces_400Regular',
  frauncesSemi: 'Fraunces_600SemiBold',
  frauncesBold: 'Fraunces_700Bold',
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemi: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
};

export const textStyles: Record<string, TextStyle> = {
  screenTitle: {
    fontFamily: F.frauncesBold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.primary,
  },
  sectionTitle: {
    fontFamily: F.frauncesSemi,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primary,
  },
  cardTitle: {
    fontFamily: F.frauncesSemi,
    fontSize: 18,
    lineHeight: 24,
    color: colors.primary,
  },
  bodyText: {
    fontFamily: F.inter,
    fontSize: 14,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  labelText: {
    fontFamily: F.interMedium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.onSurface,
  },
  buttonText: {
    fontFamily: F.interSemi,
    fontSize: 14,
    lineHeight: 20,
    color: colors.onPrimary,
  },
  priceText: {
    fontFamily: F.interBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.primary,
  },
};

export const fonts = F;