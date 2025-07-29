import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_CONFIG, TABLE_NAMES, CHANNELS } from '../constants/config';
import { Order, OrderStatus, OrderUpdatePayload, RealtimePayload } from '../types/order';

/**
 * Supabase client instance
 */
let supabase: SupabaseClient;

/**
 * Initialize Supabase client
 * Call this once when the app starts
 */
export function initializeSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
  }
  return supabase;
}

/**
 * Get the Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Call initializeSupabase() first.');
  }
  return supabase;
}

/**
 * Fetch all orders from the orders_demo table
 * 
 * @returns Promise resolving to array of orders or error
 */
export async function fetchOrders(): Promise<{ data: Order[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: null, error };
  }
}

/**
 * Fetch orders filtered by status
 * 
 * @param status - The order status to filter by
 * @returns Promise resolving to array of orders or error
 */
export async function fetchOrdersByStatus(status: OrderStatus): Promise<{ data: Order[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    return { data: null, error };
  }
}

/**
 * Fetch active orders (pending, incoming and processing)
 * 
 * @returns Promise resolving to array of active orders or error
 */
export async function fetchActiveOrders(): Promise<{ data: Order[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('*')
      .in('status', ['pending', 'incoming', 'processing'])
      .order('id', { ascending: false }); // Use id instead of created_at for compatibility

    return { data, error };
  } catch (error) {
    console.error('Error fetching active orders:', error);
    return { data: null, error };
  }
}

/**
 * Fetch completed orders
 * 
 * @returns Promise resolving to array of completed orders or error
 */
export async function fetchCompletedOrders(): Promise<{ data: Order[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('*')
      .eq('status', 'complete')
      .order('id', { ascending: false }); // Use id instead of created_at for compatibility

    return { data, error };
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    return { data: null, error };
  }
}

/**
 * Update an order's status
 * 
 * @param orderId - The ID of the order to update
 * @param payload - The update payload containing new status
 * @returns Promise resolving to updated order or error
 */
export async function updateOrderStatus(
  orderId: number, 
  payload: OrderUpdatePayload
): Promise<{ data: Order | null; error: any }> {
  try {
    const client = getSupabaseClient();
    // Don't include updated_at since the column doesn't exist in the database
    const updateData = {
      ...payload,
    };

    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    return { data: null, error };
  }
}

/**
 * Subscribe to real-time changes in the orders table
 * 
 * @param callback - Function to call when orders change
 * @returns RealtimeChannel for managing the subscription
 */
export function subscribeToOrders(
  callback: (payload: RealtimePayload) => void
): RealtimeChannel {
  const client = getSupabaseClient();
  
  const channel = client
    .channel(CHANNELS.ORDERS)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: TABLE_NAMES.ORDERS,
      },
      (payload: any) => {
        console.log('Real-time update received:', payload);
        callback({
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old,
          errors: payload.errors,
        });
      }
    );

  // Subscribe to the channel
  channel.subscribe((status) => {
    console.log('Subscription status:', status);
  });

  return channel;
}

/**
 * Unsubscribe from real-time changes
 * 
 * @param channel - The channel to unsubscribe from
 */
export function unsubscribeFromOrders(channel: RealtimeChannel): void {
  if (channel) {
    getSupabaseClient().removeChannel(channel);
  }
}

/**
 * Test database connection
 * 
 * @returns Promise resolving to connection status
 */
export async function testConnection(): Promise<{ success: boolean; error?: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('count', { count: 'exact', head: true });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { success: false, error };
  }
}
