import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
  Switch,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface BranchInfo {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  totalOrders: number;
  activeOrders: number;
  dailyRevenue: number;
  averageOrderTime: number;
  staffCount: number;
}

interface BranchManagementScreenProps {
  onBack: () => void;
}

export function BranchManagementScreen({ onBack }: BranchManagementScreenProps) {
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Mock data for demonstration - replace with actual API calls
  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading branch data...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBranches: BranchInfo[] = [
        {
          id: '1',
          name: 'Downtown Main',
          location: '123 Main Street, Downtown',
          isActive: true,
          totalOrders: 145,
          activeOrders: 12,
          dailyRevenue: 3245.50,
          averageOrderTime: 18,
          staffCount: 8,
        },
        {
          id: '2',
          name: 'Westside Plaza',
          location: '456 West Avenue, Plaza District',
          isActive: true,
          totalOrders: 98,
          activeOrders: 7,
          dailyRevenue: 2156.75,
          averageOrderTime: 22,
          staffCount: 6,
        },
        {
          id: '3',
          name: 'East Mall',
          location: '789 East Boulevard, Shopping Mall',
          isActive: false,
          totalOrders: 67,
          activeOrders: 3,
          dailyRevenue: 1432.25,
          averageOrderTime: 25,
          staffCount: 4,
        },
      ];
      
      setBranches(mockBranches);
      console.log('✅ Branch data loaded:', mockBranches.length, 'branches');
    } catch (error) {
      console.error('❌ Error loading branch data:', error);
      Alert.alert('Error', 'Failed to load branch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const toggleBranchStatus = async (branchId: string) => {
    try {
      console.log('🔄 Toggling branch status:', branchId);
      setBranches(prev => 
        prev.map(branch => 
          branch.id === branchId 
            ? { ...branch, isActive: !branch.isActive }
            : branch
        )
      );
      console.log('✅ Branch status updated');
    } catch (error) {
      console.error('❌ Error toggling branch status:', error);
      Alert.alert('Error', 'Failed to update branch status');
    }
  };

  const selectBranch = (branchId: string) => {
    setSelectedBranch(selectedBranch === branchId ? null : branchId);
  };

  const getTotalStats = () => {
    const activeBranches = branches.filter(b => b.isActive);
    return {
      totalBranches: branches.length,
      activeBranches: activeBranches.length,
      totalRevenue: branches.reduce((sum, b) => sum + b.dailyRevenue, 0),
      totalActiveOrders: branches.reduce((sum, b) => sum + b.activeOrders, 0),
      totalStaff: branches.reduce((sum, b) => sum + b.staffCount, 0),
    };
  };

  const stats = getTotalStats();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Branch Management</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.loadingText}>Loading branch data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Branch Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Branch</Text>
        </TouchableOpacity>
      </View>

      {/* Overview Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalBranches}</Text>
            <Text style={styles.statLabel}>Total Branches</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.complete }]}>
              {stats.activeBranches}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              ${stats.totalRevenue.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Daily Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.incoming }]}>
              {stats.totalActiveOrders}
            </Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </View>
        </View>
      </View>

      {/* Branch List */}
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadBranches} />
        }
      >
        {branches.map((branch) => (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <View style={styles.branchInfo}>
                <View style={styles.branchTitleRow}>
                  <Text style={styles.branchName}>{branch.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: branch.isActive ? COLORS.complete : COLORS.error }
                  ]}>
                    <Text style={styles.statusText}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.branchLocation}>{branch.location}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => selectBranch(branch.id)}
              >
                <Text style={styles.expandButtonText}>
                  {selectedBranch === branch.id ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Branch Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{branch.activeOrders}</Text>
                <Text style={styles.metricLabel}>Active Orders</Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: COLORS.primary }]}>
                  ${branch.dailyRevenue.toFixed(0)}
                </Text>
                <Text style={styles.metricLabel}>Revenue</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{branch.averageOrderTime}m</Text>
                <Text style={styles.metricLabel}>Avg Time</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{branch.staffCount}</Text>
                <Text style={styles.metricLabel}>Staff</Text>
              </View>
            </View>

            {/* Expanded Details */}
            {selectedBranch === branch.id && (
              <View style={styles.expandedDetails}>
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Branch Controls</Text>
                  
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Branch Status</Text>
                    <Switch
                      value={branch.isActive}
                      onValueChange={() => toggleBranchStatus(branch.id)}
                      trackColor={{ false: COLORS.border, true: COLORS.complete }}
                      thumbColor={COLORS.surface}
                    />
                  </View>
                </View>

                <View style={styles.actionsSection}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Kitchen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                      Edit Branch
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
                    <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                      Delete Branch
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
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
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  backButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  
  backButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
  },
  
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onSurface,
  },
  
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  
  addButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface,
  },
  
  placeholder: {
    width: 80,
  },
  
  loadingText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
  },
  
  // Stats Section
  statsContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statCard: {
    alignItems: 'center',
  },
  
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onSurface,
    fontWeight: '700',
  },
  
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.xs,
  },
  
  // Branch Cards
  scrollView: {
    flex: 1,
    padding: SPACING.lg,
  },
  
  branchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  
  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  branchInfo: {
    flex: 1,
  },
  
  branchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  
  branchName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
    flex: 1,
  },
  
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.md,
  },
  
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  
  branchLocation: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
  },
  
  expandButton: {
    padding: SPACING.sm,
  },
  
  expandButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
  },
  
  // Metrics
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  
  metric: {
    alignItems: 'center',
  },
  
  metricValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
    fontWeight: '600',
  },
  
  metricLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.xs,
  },
  
  // Expanded Details
  expandedDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.lg,
    backgroundColor: COLORS.surfaceVariant,
  },
  
  detailsSection: {
    marginBottom: SPACING.lg,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
    marginBottom: SPACING.md,
  },
  
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  
  controlLabel: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
  },
  
  // Actions
  actionsSection: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  
  actionButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface,
  },
  
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  secondaryButtonText: {
    color: COLORS.onSurface,
  },
  
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  
  dangerButtonText: {
    color: COLORS.surface,
  },
});
