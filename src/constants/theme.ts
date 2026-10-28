// src/constants/theme.ts
// Design tokens derived from the approved "Artisanal Warmth" concept
// (assets/stitch_sipora_caf_mobile_app_UI_REF/artisanal_warmth/DESIGN.md).
// These are the single source of truth for the UI. Do not hardcode values.

export const colors = {
  // Surfaces
  surface: '#fef9f0',
  surfaceDim: '#ded9d1',
  surfaceBright: '#fef9f0',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f8f3ea',
  surfaceContainer: '#f2ede4',
  surfaceContainerHigh: '#ece8df',
  surfaceContainerHighest: '#e7e2d9',
  // Text
  onSurface: '#1d1c16',
  onSurfaceVariant: '#504441',
  inverseSurface: '#32302b',
  inverseOnSurface: '#f5f0e7',
  // Brand
  primary: '#241009',
  onPrimary: '#ffffff',
  primaryContainer: '#3b241c',
  onPrimaryContainer: '#ab897e',
  inversePrimary: '#e4beb2',
  secondary: '#7d5543',
  onSecondary: '#ffffff',
  secondaryContainer: '#fec9b2',
  onSecondaryContainer: '#7a5240',
  tertiary: '#260f00',
  onTertiary: '#ffffff',
  tertiaryContainer: '#442000',
  onTertiaryContainer: '#c3824d',
  // Feedback
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  // Misc
  outline: '#827470',
  outlineVariant: '#d4c3be',
  surfaceTint: '#75584e',
  background: '#fef9f0',
  onBackground: '#1d1c16',
  // Fixed
  primaryFixed: '#ffdbcf',
  primaryFixedDim: '#e4beb2',
  secondaryFixed: '#ffdbcc',
  secondaryFixedDim: '#efbba5',
  tertiaryFixed: '#ffdcc3',
  tertiaryFixedDim: '#ffb77f',
  // Caramel accent (badges)
  caramel: '#b87945',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  gutterMobile: 12,
  margin: 20,
  marginMobile: 16,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const typography = {
  // Fonts: Fraunces (headings) + Inter (body/UI)
  headline: 'Fraunces_600SemiBold',
  headlineBold: 'Fraunces_700Bold',
  headlineRegular: 'Fraunces_400Regular',
  headlineSemiBold: 'Fraunces_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  sizes: {
    headlineXl: 36,
    headlineXlMobile: 28,
    headlineLg: 24,
    headlineMd: 20,
    headlineSm: 18,
    bodyLg: 16,
    bodyMd: 14,
    bodySm: 12,
    labelLg: 14,
    labelMd: 12,
    labelSm: 10,
  },
  lineHeights: {
    headlineXl: 44,
    headlineXlMobile: 36,
    headlineLg: 32,
    headlineMd: 28,
    headlineSm: 24,
    bodyLg: 24,
    bodyMd: 20,
    bodySm: 18,
    labelLg: 20,
    labelMd: 16,
    labelSm: 14,
  },
} as const;

export const shadows = {
  level1: {
    shadowColor: '#3b241c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  level2: {
    shadowColor: '#3b241c',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const theme = { colors, spacing, radii, typography, shadows } as const;
export default theme;