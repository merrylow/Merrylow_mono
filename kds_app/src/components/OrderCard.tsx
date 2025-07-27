import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Order, OrderStatus } from '../types/order';
import { StatusButton } from './StatusButton';
import { formatOrderString, formatTime, getTimeElapsed } from '../utils/formatOrder';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
  style?: ViewStyle;
}

/**
 * Reusable component to display an order with status update functionality
 * Optimized for tablet viewing with large, readable text
 */
export function OrderCard({ order, onStatusUpdate, style }: OrderCardProps) {
  const handleStatusUpdate = () => {
    let newStatus: OrderStatus;
    
    switch (order.status) {
      case 'incoming':
        newStatus = 'processing';
        break;
      case 'processing':
      case 'pending':
        newStatus = 'complete';
        break;
      default:
        return; // Don't update if already complete
    }
    
    onStatusUpdate(order.id, newStatus);
  };

  const getStatusColor = (): string => {
    switch (order.status) {
      case 'incoming':
        return COLORS.incoming;
      case 'processing':
      case 'pending':
        return COLORS.processing;
      case 'complete':
        return COLORS.complete;
      default:
        return COLORS.onSurfaceVariant;
    }
  };

  const getStatusText = (): string => {
    switch (order.status) {
      case 'incoming':
        return 'INCOMING';
      case 'processing':
      case 'pending':
        return 'PROCESSING';
      case 'complete':
        return 'COMPLETE';
      default:
        return (order.status as string).toUpperCase();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header with order ID and status */}
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Order details */}
      <View style={styles.content}>
        <Text style={styles.orderDescription}>
          {formatOrderString(order)}
        </Text>
        
        {/* Time information */}
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>
            Created: {formatTime(order.created_at)}
          </Text>
          <Text style={styles.elapsedText}>
            {getTimeElapsed(order.created_at)}
          </Text>
        </View>
      </View>

      {/* Action button */}
      <View style={styles.actions}>
        <StatusButton
          status={order.status}
          onPress={handleStatusUpdate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  orderId: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
  },
  
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
  
  content: {
    marginBottom: SPACING.lg,
  },
  
  orderDescription: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
    marginBottom: SPACING.md,
    lineHeight: 28,
  },
  
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  timeText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
  },
  
  elapsedText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    fontStyle: 'italic',
  },
  
  actions: {
    alignItems: 'flex-start',
  },
});
