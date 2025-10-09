// designSystem.js - Web version adapted from mobile app
export const Colors = {
  primary: '#0A2540',
  primaryAccent: '#2563EB',
  primaryLight: '#93C5FD',
  secondary: '#8B5CF6',
  secondaryDark: '#7C3AED',
  accent: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  background: '#F8FAFC',
  surface: '#f6fafdff',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#9CA3AF',
  border: '#E2E8F0',
  borderLight: '#F3F4F6',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',

  milky: '#f9f7f5ff',
};

export const Spacing = {
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '40px',
  xxxl: '48px',
  xxxxl: '60px',
};

export const Typography = {
  h1: {
    fontSize: '2rem',
    fontWeight: '800',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.textPrimary,
    letterSpacing: '-0.5px',
    lineHeight: '1.2',
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: '700',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.textPrimary,
    letterSpacing: '-0.3px',
    lineHeight: '1.3',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: '600',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.textPrimary,
    letterSpacing: '-0.2px',
    lineHeight: '1.4',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: '600',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.textPrimary,
    lineHeight: '1.4',
  },
  body: {
    fontSize: '1rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.textPrimary,
    lineHeight: '1.6',
  },
  bodySmall: {
    fontSize: '0.875rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.textSecondary,
    lineHeight: '1.5',
  },
  caption: {
    fontSize: '0.75rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.textTertiary,
    lineHeight: '1.4',
  },
  button: {
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.surface,
  },
  link: {
    fontSize: '1rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: Colors.primary,
    textAlign: 'center',
  },
};

export const Shadows = {
  small: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  medium: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  large: {
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
  },
  xl: {
    boxShadow: '0 12px 16px rgba(0, 0, 0, 0.2)',
  },
};

export const BorderRadius = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  round: '9999px',
};

export const CommonStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${Spacing.lg}`,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.medium,
  },
  cardElevated: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.large,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: `${Spacing.sm} ${Spacing.lg}`,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.md,
    padding: `${Spacing.sm} ${Spacing.lg}`,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};