import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { OrderAnalytics } from '../types/menu';
import { fetchOrderAnalytics } from '../services/supabase';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface ManagementDashboardProps {
  onNavigateToMenu: () => void;
}

export function ManagementDashboard({ onNavigateToMenu }: ManagementDashboardProps) {
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAnalytics = useCallback(async () => {
    try {
      console.log('🔄 Loading analytics data...');
      const { data, error } = await fetchOrderAnalytics();
      if (error) {
        console.error('❌ Error loading analytics:', error);
        Alert.alert('Error', `Failed to load analytics data: ${error.message || 'Unknown error'}`);
      } else {
        console.log('✅ Analytics data loaded:', data);
        setAnalytics(data);
      }
    } catch (error) {
      console.error('❌ Error in loadAnalytics:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadAnalytics();
  }, [loadAnalytics]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Management Dashboard</Text>
          <Text style={styles.subtitle}>Today's Performance Overview</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onNavigateToMenu}
            >
              <Text style={styles.actionButtonText}>Manage Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Metrics */}
        {analytics && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Statistics</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{analytics.totalOrders}</Text>
                  <Text style={styles.metricLabel}>Total Orders</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{analytics.completedOrders}</Text>
                  <Text style={styles.metricLabel}>Completed</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{analytics.pendingOrders}</Text>
                  <Text style={styles.metricLabel}>Pending</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{analytics.inProgressOrders}</Text>
                  <Text style={styles.metricLabel}>In Progress</Text>
                </View>
              </View>
            </View>

            {/* Performance Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>
                    {Math.round(analytics.averageCompletionTime)}m
                  </Text>
                  <Text style={styles.metricLabel}>Avg. Completion</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>
                    ${analytics.revenueToday.toFixed(2)}
                  </Text>
                  <Text style={styles.metricLabel}>Revenue Today</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>
                    {analytics.totalOrders > 0 
                      ? Math.round((analytics.completedOrders / analytics.totalOrders) * 100)
                      : 0}%
                  </Text>
                  <Text style={styles.metricLabel}>Success Rate</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{analytics.rejectedOrders}</Text>
                  <Text style={styles.metricLabel}>Rejected</Text>
                </View>
              </View>
            </View>

            {/* Hourly Distribution */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Distribution by Hour</Text>
              <View style={styles.chartContainer}>
                {analytics.ordersByHour.map(({ hour, count }) => (
                  <View key={hour} style={styles.hourBar}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: Math.max(count * 4, 2),
                          backgroundColor: count > 0 ? COLORS.primary : COLORS.surfaceVariant
                        }
                      ]} 
                    />
                    <Text style={styles.hourLabel}>{hour}</Text>
                    <Text style={styles.countLabel}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
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
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.onSurface,
  },
  
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.xs,
  },
  
  section: {
    margin: SPACING.lg,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
    marginBottom: SPACING.md,
  },
  
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  
  actionButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
  },
  
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  
  metricValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    fontWeight: '700',
  },
  
  metricLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  
  chartContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
    alignItems: 'flex-end',
    minHeight: 120,
  },
  
  hourBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  
  bar: {
    width: '80%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: SPACING.xs,
  },
  
  hourLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
  },
  
  countLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurface,
    fontSize: 10,
    fontWeight: '600',
  },
  
  loadingText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
  },
});
