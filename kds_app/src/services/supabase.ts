import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_CONFIG, TABLE_NAMES, CHANNELS } from '../constants/config';
import { Order, OrderStatus, OrderUpdatePayload, RealtimePayload } from '../types/order';
import { MenuItem, OrderAnalytics } from '../types/menu';

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
 * Fetch active orders (pending and in_progress)
 * Also normalizes any orders with null status to 'pending'
 * 
 * @returns Promise resolving to array of active orders or error
 */
export async function fetchActiveOrders(): Promise<{ data: Order[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    
    // First, update any orders with null status to 'pending'
    await client
      .from(TABLE_NAMES.ORDERS)
      .update({ status: 'pending' })
      .is('status', null);
    
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .order('id', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Error fetching active orders:', error);
    return { data: null, error };
  }
}

/**
 * Fetch completed orders (completed and rejected)
 * 
 * @returns Promise resolving to array of completed orders or error
 */
export async function fetchCompletedOrders(): Promise<{ data: Order[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('*')
      .in('status', ['completed', 'rejected'])
      .order('id', { ascending: false });

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

/**
 * Get all unique statuses currently in the database
 * Useful for debugging status enum issues
 */
export async function getUniqueStatuses(): Promise<{ data: string[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('status');

    if (error) {
      return { data: null, error };
    }

    const uniqueStatuses = [...new Set(data?.map((order: any) => order.status) || [])];
    console.log('Unique statuses in database:', uniqueStatuses);
    
    return { data: uniqueStatuses, error: null };
  } catch (error) {
    console.error('Error fetching unique statuses:', error);
    return { data: null, error };
  }
}

// ============================================================================
// MENU MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Fetch all menu items
 */
export async function fetchMenuItems(): Promise<{ data: MenuItem[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.MENU)
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    return { data, error };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return { data: null, error };
  }
}

/**
 * Create a new menu item
 */
export async function createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: MenuItem | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.MENU)
      .insert(item)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error creating menu item:', error);
    return { data: null, error };
  }
}

/**
 * Update a menu item
 */
export async function updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<{ data: MenuItem | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.MENU)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error updating menu item:', error);
    return { data: null, error };
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: number): Promise<{ error: any }> {
  try {
    const client = getSupabaseClient();
    const { error } = await client
      .from(TABLE_NAMES.MENU)
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return { error };
  }
}

/**
 * Get order analytics for management dashboard
 */
export async function fetchOrderAnalytics(): Promise<{ data: OrderAnalytics | null; error: any }> {
  try {
    const client = getSupabaseClient();
    
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    console.log('Fetching analytics for date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

    // Fetch all orders for today
    const { data: orders, error } = await client
      .from(TABLE_NAMES.ORDERS)
      .select('*')
      .gte('created_at', startOfDay.toISOString())
      .lt('created_at', endOfDay.toISOString());

    if (error) {
      console.error('Error fetching orders for analytics:', error);
      return { data: null, error };
    }

    console.log(`Found ${orders?.length || 0} orders for today`);

    // Calculate analytics
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
    const inProgressOrders = orders?.filter(o => o.status === 'in_progress').length || 0;
    const rejectedOrders = orders?.filter(o => o.status === 'rejected').length || 0;

    // Calculate average completion time for completed orders
    const completedOrdersWithTime = orders?.filter(o => 
      o.status === 'completed' && o.updated_at && o.created_at
    ) || [];
    
    const averageCompletionTime = completedOrdersWithTime.length > 0 
      ? completedOrdersWithTime.reduce((sum, order) => {
          const created = new Date(order.created_at).getTime();
          const completed = new Date(order.updated_at).getTime();
          return sum + (completed - created);
        }, 0) / completedOrdersWithTime.length / (1000 * 60) // Convert to minutes
      : 0;

    // Calculate revenue - check if total_amount field exists, otherwise use a default
    const revenueToday = orders?.reduce((sum, order) => {
      // Handle different possible field names for order total
      const orderValue = order.total_amount || order.total || order.amount || 0;
      return sum + (typeof orderValue === 'number' ? orderValue : 0);
    }, 0) || 0;

    // Orders by hour
    const ordersByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: orders?.filter(order => {
        const orderHour = new Date(order.created_at).getHours();
        return orderHour === hour;
      }).length || 0
    }));

    const analytics: OrderAnalytics = {
      totalOrders,
      completedOrders,
      pendingOrders,
      inProgressOrders,
      rejectedOrders,
      averageCompletionTime: Math.round(averageCompletionTime),
      revenueToday,
      topSellingItems: [], // TODO: Implement based on order items when available
      ordersByHour
    };

    console.log('Analytics calculated:', analytics);
    return { data: analytics, error: null };
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    return { data: null, error };
  }
}

/**
 * Fetch unique categories from menu items
 */
export async function fetchCategories(): Promise<{ data: string[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAMES.MENU)
      .select('category')
      .not('category', 'is', null);

    if (error) {
      return { data: null, error };
    }

    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] as string[];
    return { data: categories.sort(), error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
}
