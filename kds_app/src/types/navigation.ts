/**
 * Navigation type definitions for React Navigation
 */
export type RootStackParamList = {
  ActiveOrders: undefined;
  CompletedOrders: undefined;
};

/**
 * Screen names for consistent navigation
 */
export const SCREEN_NAMES = {
  ACTIVE_ORDERS: 'ActiveOrders',
  COMPLETED_ORDERS: 'CompletedOrders',
} as const;
