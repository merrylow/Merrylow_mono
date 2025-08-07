/**
 * Supabase configuration constants
 * Replace these with your actual Supabase project credentials
 */
export const SUPABASE_CONFIG = {
  URL: 'https://izjzinivxxyhxzsmgfwc.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6anppbml2eHh5aHh6c21nZndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Mjg1NTYsImV4cCI6MjA2ODEwNDU1Nn0.HW7C7NrFqm9d2xTcPHJXqYpw9hCENWxFkpR6tr4ZmUQ',
};

/**
 * Database table names
 */
export const TABLE_NAMES = {
  ORDERS: 'orders_demo',
  MENU: 'menus',
} as const;

/**
 * Real-time subscription channels
 */
export const CHANNELS = {
  ORDERS: 'orders-channel',
} as const;

/**
 * Order status constants
 */
export const ORDER_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;
