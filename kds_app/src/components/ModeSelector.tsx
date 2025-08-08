import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppMode } from '../types/menu';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.selector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'kitchen' && styles.activeButton
          ]}
          onPress={() => onModeChange('kitchen')}
        >
          <Text style={[
            styles.modeText,
            currentMode === 'kitchen' && styles.activeText
          ]}>
            Kitchen Mode
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'management' && styles.activeButton
          ]}
          onPress={() => onModeChange('management')}
        >
          <Text style={[
            styles.modeText,
            currentMode === 'management' && styles.activeText
          ]}>
            Management Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  selector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  
  modeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  activeButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  
  modeText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onSurfaceVariant,
  },
  
  activeText: {
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
});
