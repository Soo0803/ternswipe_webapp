export const palette = {
  // Core brand colors – teal & warm accent
  primary: '#2EC4B6',
  primaryHover: '#24AD9F',
  primarySoft: 'rgba(46, 196, 182, 0.12)',
  secondary: '#FFBF69',
  secondarySoft: 'rgba(255, 191, 105, 0.16)',
  // Neutrals
  background: '#04090E',
  surface: '#0F141B',
  surfaceMuted: '#151B24',
  surfaceElevated: '#1C2330',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  overlay: 'rgba(8, 12, 18, 0.68)',
  // Typography
  text: '#F6F7FB',
  textMuted: 'rgba(246, 247, 251, 0.8)',
  textSubtle: 'rgba(246, 247, 251, 0.55)',
  textOnPrimary: '#041012',
  textOnMuted: '#E6FFF8',
  // Status
  success: '#3DD68C',
  successSoft: 'rgba(61, 214, 140, 0.16)',
  warning: '#FFBA49',
  warningSoft: 'rgba(255, 186, 73, 0.18)',
  danger: '#FF6F6F',
  dangerSoft: 'rgba(255, 111, 111, 0.18)',
  info: '#47A3FF',
  infoSoft: 'rgba(71, 163, 255, 0.18)',
};

export const typography = {
  family: {
    sans: 'Inter, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 28,
  pill: 999,
};

export const shadows = {
  sm: {
    shadowColor: 'rgba(12, 18, 32, 0.24)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: 'rgba(12, 18, 32, 0.28)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 9,
  },
  lg: {
    shadowColor: 'rgba(12, 18, 32, 0.32)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 44,
    elevation: 14,
  },
};

export const layout = {
  maxWidth: 1440,
  contentWidth: 1040,
  sidebarWidth: 280,
};

export const transitions = {
  duration: {
    fast: 120,
    normal: 200,
    slow: 300,
  },
};

export type ThemePalette = typeof palette;

