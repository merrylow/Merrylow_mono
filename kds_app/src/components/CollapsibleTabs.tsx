import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated 
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CollapsibleTabsProps {
  activeTab: 'active' | 'completed';
  onTabChange: (tab: 'active' | 'completed') => void;
  activeOrderCount?: number;
  completedOrderCount?: number;
}

/**
 * Collapsible tab navigation component
 * Provides navigation between Active Orders and Completed Orders screens
 */
export function CollapsibleTabs({ 
  activeTab, 
  onTabChange, 
  activeOrderCount = 0, 
  completedOrderCount = 0 
}: CollapsibleTabsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={[styles.tabContainer, isCollapsed && styles.collapsedContainer]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'active' && styles.activeTabButton,
            isCollapsed && styles.collapsedTab
          ]}
          onPress={() => onTabChange('active')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'active' && styles.activeTabText,
            isCollapsed && styles.collapsedTabText
          ]}>
            {isCollapsed ? `A (${activeOrderCount})` : `Active Orders (${activeOrderCount})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'completed' && styles.activeTabButton,
            isCollapsed && styles.collapsedTab
          ]}
          onPress={() => onTabChange('completed')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'completed' && styles.activeTabText,
            isCollapsed && styles.collapsedTabText
          ]}>
            {isCollapsed ? `C (${completedOrderCount})` : `Completed Orders (${completedOrderCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Collapse/Expand Button */}
      <TouchableOpacity
        style={styles.collapseButton}
        onPress={toggleCollapse}
        activeOpacity={0.7}
      >
        <Text style={styles.collapseButtonText}>
          {isCollapsed ? '→' : '←'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    flex: 1,
  },
  
  collapsedContainer: {
    width: 120,
    flex: 0,
  },
  
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  collapsedTab: {
    paddingHorizontal: SPACING.sm,
    minWidth: 48,
  },
  
  activeTabButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  
  tabText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  
  collapsedTabText: {
    fontSize: 18,
    fontWeight: '700',
  },
  
  activeTabText: {
    color: COLORS.onPrimary,
  },
  
  collapseButton: {
    marginLeft: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  collapseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
});
