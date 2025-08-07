import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CollapsibleTabs } from '../components/CollapsibleTabs';
import { ActiveOrdersScreen } from './ActiveOrdersScreen';
import { CompletedOrdersScreen } from './CompletedOrdersScreen';
import { Order, OrderStatus, RealtimePayload } from '../types/order';
import { 
  fetchActiveOrders, 
  fetchCompletedOrders,
  updateOrderStatus, 
  subscribeToOrders, 
  unsubscribeFromOrders 
} from '../services/supabase';
import { speakOrder } from '../utils/formatOrder';
import { COLORS } from '../constants/theme';

/**
 * Main Kitchen Display Screen
 * Centrally manages all order state and real-time updates
 */

/**
 * Normalize order status - assign 'pending' to orders with invalid or missing status
 */
function normalizeOrderStatus(order: Order): Order {
  const validStatuses: OrderStatus[] = ['pending', 'in_progress', 'completed', 'rejected'];
  
  if (!order.status || !validStatuses.includes(order.status as OrderStatus)) {
    console.log(`Normalizing order ${order.id} status from '${order.status}' to 'pending'`);
    return { ...order, status: 'pending' };
  }
  
  return order;
}

export function KitchenDisplayScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [incomingOrders, setIncomingOrders] = useState<Order[]>([]);
  const [processingOrders, setProcessingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  /**
   * Load all orders from Supabase
   */
  const loadOrders = useCallback(async () => {
    try {
      // Load active orders
      const { data: activeData, error: activeError } = await fetchActiveOrders();
      if (activeError) {
        console.error('Error loading active orders:', activeError);
        console.log('Active error details:', JSON.stringify(activeError, null, 2));
        // Don't return immediately - try to continue with what we have
        Alert.alert('Warning', `Failed to load some active orders: ${activeError.message || 'Unknown error'}`);
      }

      // Load completed orders
      const { data: completedData, error: completedError } = await fetchCompletedOrders();
      if (completedError) {
        console.error('Error loading completed orders:', completedError);
        console.log('Completed error details:', JSON.stringify(completedError, null, 2));
        Alert.alert('Warning', `Failed to load completed orders: ${completedError.message || 'Unknown error'}`);
      }

      if (activeData && activeData.length > 0) {
        // Normalize orders and separate by status
        const normalizedOrders = activeData.map(normalizeOrderStatus);
        
        // Incoming orders (pending - new orders ready to be started)
        const incomingOrders = normalizedOrders.filter(order => order.status === 'pending');
        // Processing orders (in_progress - orders being worked on)
        const processingOrders = normalizedOrders.filter(order => order.status === 'in_progress');
        
        console.log(`Loaded ${incomingOrders.length} incoming orders and ${processingOrders.length} processing orders`);
        setIncomingOrders(incomingOrders);
        setProcessingOrders(processingOrders);
      } else {
        console.log('No active orders found');
        setIncomingOrders([]);
        setProcessingOrders([]);
      }

      if (completedData && completedData.length > 0) {
        const normalizedCompletedOrders = completedData.map(normalizeOrderStatus);
        console.log(`Loaded ${normalizedCompletedOrders.length} completed orders`);
        setCompletedOrders(normalizedCompletedOrders);
      } else {
        console.log('No completed orders found');
        setCompletedOrders([]);
      }
    } catch (error) {
      console.error('Error in loadOrders:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle real-time updates from Supabase
   */
  const handleRealtimeUpdate = useCallback((payload: RealtimePayload) => {
    console.log('Real-time update:', payload);
    
    // Normalize status for new and updated orders
    if (payload.eventType === 'INSERT' && payload.new) {
      payload.new = normalizeOrderStatus(payload.new);
    }
    
    if (payload.eventType === 'UPDATE' && payload.new) {
      payload.new = normalizeOrderStatus(payload.new);
    }
    
    switch (payload.eventType) {
      case 'INSERT':
        // Add new order to appropriate section
        if (payload.new.status === 'pending') {
          setIncomingOrders(prev => [payload.new, ...prev]);
          // Announce incoming order with TTS
          speakOrder(payload.new).catch(error => {
            console.error('TTS error for new order:', error);
          });
        } else if (payload.new.status === 'in_progress') {
          setProcessingOrders(prev => [payload.new, ...prev]);
        } else if (payload.new.status === 'completed' || payload.new.status === 'rejected') {
          setCompletedOrders(prev => [payload.new, ...prev]);
        }
        break;
        
      case 'UPDATE':
        const updatedOrder = payload.new;
        const orderId = updatedOrder.id;
        
        // Remove from all sections first
        setIncomingOrders(prev => prev.filter(order => order.id !== orderId));
        setProcessingOrders(prev => prev.filter(order => order.id !== orderId));
        setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
        
        // Add to appropriate section based on new status
        if (updatedOrder.status === 'pending') {
          setIncomingOrders(prev => [updatedOrder, ...prev]);
          // Announce if order status changed to pending
          speakOrder(updatedOrder).catch(error => {
            console.error('TTS error for updated order:', error);
          });
        } else if (updatedOrder.status === 'in_progress') {
          setProcessingOrders(prev => [updatedOrder, ...prev]);
        } else if (updatedOrder.status === 'completed' || updatedOrder.status === 'rejected') {
          setCompletedOrders(prev => [updatedOrder, ...prev]);
        }
        break;
        
      case 'DELETE':
        const deletedOrderId = payload.old.id;
        setIncomingOrders(prev => prev.filter(order => order.id !== deletedOrderId));
        setProcessingOrders(prev => prev.filter(order => order.id !== deletedOrderId));
        setCompletedOrders(prev => prev.filter(order => order.id !== deletedOrderId));
        break;
    }
  }, []);

  /**
   * Handle status update with optimistic UI updates
   */
  const handleStatusUpdate = useCallback(async (orderId: number, newStatus: OrderStatus) => {
    try {
      // Find the order in current state
      const allActiveOrders = [...incomingOrders, ...processingOrders];
      const orderToUpdate = allActiveOrders.find(order => order.id === orderId);
      if (!orderToUpdate) return;

      // Optimistic update: immediately move order to new section
      const updatedOrder = { ...orderToUpdate, status: newStatus };
      
      // Remove from current sections
      setIncomingOrders(prev => prev.filter(order => order.id !== orderId));
      setProcessingOrders(prev => prev.filter(order => order.id !== orderId));
      
      // Add to new section based on status
      if (newStatus === 'in_progress') {
        setProcessingOrders(prev => [updatedOrder, ...prev]);
      } else if (newStatus === 'completed' || newStatus === 'rejected') {
        setCompletedOrders(prev => [updatedOrder, ...prev]);
      }
      
      // Update in database
      const { error } = await updateOrderStatus(orderId, { status: newStatus });
      
      if (error) {
        console.error('Error updating order status:', error);
        // Revert optimistic update by reloading data
        loadOrders();
        Alert.alert('Error', 'Failed to update order status. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleStatusUpdate:', error);
      // Revert optimistic update
      loadOrders();
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  }, [incomingOrders, processingOrders, loadOrders]);

  /**
   * Setup real-time subscription
   */
  useEffect(() => {
    // Initial load
    loadOrders();
    
    // Setup real-time subscription
    const channel = subscribeToOrders(handleRealtimeUpdate);
    setRealtimeChannel(channel);
    
    // Cleanup on unmount
    return () => {
      if (channel) {
        unsubscribeFromOrders(channel);
      }
    };
  }, [loadOrders, handleRealtimeUpdate]);

  const handleTabChange = useCallback((tab: 'active' | 'completed') => {
    setActiveTab(tab);
  }, []);

  const handleRefresh = useCallback(() => {
    loadOrders();
  }, [loadOrders]);

  // Calculate order counts
  const activeOrderCount = incomingOrders.length + processingOrders.length;
  const completedOrderCount = completedOrders.length;

  return (
    <View style={styles.container}>
      {/* Collapsible Tab Navigation */}
      <CollapsibleTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeOrderCount={activeOrderCount}
        completedOrderCount={completedOrderCount}
      />
      
      {/* Screen Content */}
      <View style={styles.content}>
        {activeTab === 'active' ? (
          <ActiveOrdersScreen 
            incomingOrders={incomingOrders}
            processingOrders={processingOrders}
            onStatusUpdate={handleStatusUpdate}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        ) : (
          <CompletedOrdersScreen 
            completedOrders={completedOrders}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  content: {
    flex: 1,
  },
});
