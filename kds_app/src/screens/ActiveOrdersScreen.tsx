import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  SafeAreaView 
} from 'react-native';
import { Order, OrderStatus } from '../types/order';
import { OrderCard } from '../components/OrderCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface ActiveOrdersScreenProps {
  incomingOrders: Order[];
  processingOrders: Order[];
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

/**
 * Active Orders Screen
 * Displays incoming and processing orders in split-screen layout
 * Receives order data as props from parent KitchenDisplayScreen
 */
export function ActiveOrdersScreen({ 
  incomingOrders, 
  processingOrders, 
  onStatusUpdate, 
  isLoading, 
  onRefresh 
}: ActiveOrdersScreenProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  }, [onRefresh]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Split Screen Layout */}
      <View style={styles.splitContainer}>
        {/* Left Side - Incoming Orders */}
        <View style={styles.leftSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Incoming Orders ({incomingOrders.length})</Text>
          </View>
          <ScrollView
            style={styles.sectionScrollView}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {incomingOrders.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No incoming orders</Text>
              </View>
            ) : (
              incomingOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={onStatusUpdate}
                  style={styles.orderCard}
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Right Side - Processing Orders */}
        <View style={styles.rightSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Processing Orders ({processingOrders.length})</Text>
          </View>
          <ScrollView
            style={styles.sectionScrollView}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {processingOrders.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No orders being processed</Text>
              </View>
            ) : (
              processingOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={onStatusUpdate}
                  style={styles.orderCard}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  
  leftSection: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  rightSection: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  verticalDivider: {
    width: 3,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  
  sectionHeader: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  sectionScrollView: {
    flex: 1,
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
  
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onSurface,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  emptySection: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  
  emptyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  orderCard: {
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
  },
});
