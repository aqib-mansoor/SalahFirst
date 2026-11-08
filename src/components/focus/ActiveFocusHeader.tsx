import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { AppText } from '@/components/common';

export interface ActiveFocusHeaderProps {
  prayerName: string;
  durationMinutes: number;
  onSimulateEnd?: () => void;
}

export const ActiveFocusHeader: React.FC<ActiveFocusHeaderProps> = ({
  prayerName,
  durationMinutes,
  onSimulateEnd,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerBadge}>
        <View style={styles.headerDot} />
        <AppText variant="caption" color={PALETTE.white} style={styles.headerTitle}>
          {prayerName} Focus • {durationMinutes}m
        </AppText>
      </View>

      {__DEV__ && onSimulateEnd && (
        <Pressable onPress={onSimulateEnd} style={styles.simulateBtn}>
          <AppText variant="caption" style={styles.simulateText}>
            DEV: End Timer
          </AppText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(5, 35, 23, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  simulateBtn: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: 'rgba(5, 35, 23, 0.6)',
  },
  simulateText: {
    fontWeight: '600',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

