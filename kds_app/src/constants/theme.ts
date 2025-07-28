/**
 * Theme constants for consistent styling across the app
 * Optimized for tablet viewing with large, readable text
 */

export const COLORS = {
  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  
  // Primary colors
  primary: '#2563EB',
  primaryVariant: '#1D4ED8',
  
  // Status colors
  incoming: '#F59E0B',    // Amber
  processing: '#3B82F6',  // Blue
  complete: '#10B981',    // Green
  
  // Text colors
  onSurface: '#1F2937',
  onSurfaceVariant: '#6B7280',
  onPrimary: '#FFFFFF',
  
  // Border and shadow
  border: '#E5E7EB',
  shadow: '#000000',
  
  // Error and warning
  error: '#EF4444',
  warning: '#F59E0B',
} as const;

export const TYPOGRAPHY = {
  // Heading sizes (large for tablet viewing)
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  
  // Body text (readable from distance)
  body1: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  body2: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  
  // Caption text
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const SHADOWS = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;
