export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  addons: any; // JSONB field from database
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  rejectedOrders: number;
  averageCompletionTime: number;
  revenueToday: number;
  topSellingItems: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  ordersByHour: Array<{
    hour: number;
    count: number;
  }>;
}

export type AppMode = 'kitchen' | 'management';
