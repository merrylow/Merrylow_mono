/**
 * Order interface matching the orders_demo table structure
 */
export interface Order {
  id: number;
  name: string;        // e.g., "1 jollof, 1 chicken"
  table_no: string;    // e.g., "Table 4" or "Takeaway"
  price: number;       // e.g., 25.00
  note: string | null; // e.g., "No onions"
  status: OrderStatus; // "pending", "incoming", "processing", "complete"
  created_at?: string; // ISO timestamp (optional for compatibility)
  updated_at?: string; // ISO timestamp (optional for compatibility)
}

/**
 * Order status enum for type safety
 */
export type OrderStatus = 'pending' | 'incoming' | 'processing' | 'complete';

/**
 * Payload for updating order status
 */
export interface OrderUpdatePayload {
  status: OrderStatus;
}

/**
 * Real-time subscription payload from Supabase
 */
export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Order;
  old: Order;
  errors: any;
}
