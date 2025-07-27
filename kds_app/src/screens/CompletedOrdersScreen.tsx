import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  SafeAreaView 
} from 'react-native';
import { Order } from '../types/order';
import { OrderCard } from '../components/OrderCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface CompletedOrdersScreenProps {
  completedOrders: Order[];
  isLoading: boolean;
  onRefresh: () => void;
}

/**
 * Completed Orders Screen
 * Displays all completed orders
 * Receives order data as props from parent KitchenDisplayScreen
 */
export function CompletedOrdersScreen({ 
  completedOrders, 
  isLoading, 
  onRefresh 
}: CompletedOrdersScreenProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  }, [onRefresh]);

  // No status updates needed for completed orders
  const handleStatusUpdate = () => {
    // Completed orders cannot be updated
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading completed orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Completed Orders ({completedOrders.length})</Text>
        </View>
        
        {completedOrders.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No completed orders yet</Text>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            {completedOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                style={styles.orderCard}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.onSurface,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
  },
  
  ordersContainer: {
    padding: SPACING.md,
  },
  
  emptySection: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  orderCard: {
    marginVertical: SPACING.sm,
  },
});
