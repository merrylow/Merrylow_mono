import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { OrderStatus } from '../types/order';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface StatusButtonProps {
  status: OrderStatus;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Reusable button component for updating order status
 * Provides visual feedback and status-specific styling
 */
export function StatusButton({ status, onPress, disabled = false, style }: StatusButtonProps) {
  const getButtonText = (): string => {
    switch (status) {
      case 'pending':
        return 'Start Cooking';
      case 'in_progress':
        return 'Mark as Ready';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Update Status';
    }
  };

  const getButtonColor = (): string => {
    switch (status) {
      case 'pending':
        return COLORS.processing;  // Blue for "start cooking"
      case 'in_progress':
        return COLORS.complete;    // Green for "mark as ready/complete"
      case 'completed':
        return COLORS.onSurfaceVariant; // Gray for completed (disabled state)
      case 'rejected':
        return COLORS.onSurfaceVariant; // Gray for rejected (disabled state)
      default:
        return COLORS.primary;
    }
  };

  const isDisabled = disabled || status === 'completed' || status === 'rejected';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getButtonColor() },
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, isDisabled && styles.disabledText]}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  
  buttonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
    textAlign: 'center',
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  disabledText: {
    color: COLORS.onSurfaceVariant,
  },
});
