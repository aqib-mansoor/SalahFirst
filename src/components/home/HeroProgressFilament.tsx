import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface HeroProgressFilamentProps {
  currentPrayerName: string;
  currentTimeFormatted: string;
  nextPrayerName: string;
  nextPrayerTimeFormatted: string;
  progressRatio?: number;
}

export const HeroProgressFilament: React.FC<HeroProgressFilamentProps> = ({
  currentPrayerName,
  currentTimeFormatted,
  nextPrayerName,
  nextPrayerTimeFormatted,
  progressRatio = 0.5,
}) => {
  const theme = useTheme();
  const clampedProgress = Math.min(100, Math.max(5, progressRatio * 100));

  return (
    <View style={styles.container}>
      {/* Time Track Row */}
      <View style={styles.labelsRow}>
        <AppText variant="caption" color={theme.colors.accentLight} style={styles.labelTime}>
          {currentPrayerName} ({currentTimeFormatted})
        </AppText>
        <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.labelNext}>
          {nextPrayerName} ({nextPrayerTimeFormatted})
        </AppText>
      </View>

      {/* Luminous Filament Track */}
      <View style={[styles.trackBackground, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}>
        <View
          style={[
            styles.trackFill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: theme.colors.accent,
            },
          ]}
        />
        {/* Glowing Progress Beacon Bead */}
        <View
          style={[
            styles.beaconDot,
            {
              left: `${clampedProgress}%`,
              backgroundColor: '#FFFFFF',
              borderColor: theme.colors.accent,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginVertical: 4,
    zIndex: 1,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  labelTime: {
    fontSize: 10.5,
    fontWeight: '700',
    opacity: 0.85,
  },
  labelNext: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  trackBackground: {
    height: 4,
    borderRadius: RADIUS.full,
    width: '100%',
    position: 'relative',
    overflow: 'visible',
    justifyContent: 'center',
  },
  trackFill: {
    height: 4,
    borderRadius: RADIUS.full,
  },
  beaconDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    marginLeft: -4,
    shadowColor: '#F7CF57',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 4,
    elevation: 3,
  },
});

