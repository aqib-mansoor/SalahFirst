import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { UserLocation } from '@/types';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { LocationActionButtons } from './LocationActionButtons';

export interface SetupLocationCardProps {
  location: UserLocation;
  isLoading: boolean;
  permissionDenied: boolean;
  onRequestGps: () => void;
  onOpenSettings: () => void;
}

export const SetupLocationCard: React.FC<SetupLocationCardProps> = ({
  location,
  isLoading,
  permissionDenied,
  onRequestGps,
  onOpenSettings,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Title & Badge Row */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.mintTint }]}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.primary} strokeWidth="2" />
          </Svg>
        </View>

        <View style={styles.titleWrapper}>
          <View style={styles.headingBadgeRow}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
              Prayer Times Location
            </AppText>
            <View style={[styles.gpsBadge, { backgroundColor: theme.colors.mintTint }]}>
              <AppText variant="caption" color={theme.colors.primary} style={styles.gpsBadgeText}>
                Auto GPS
              </AppText>
            </View>
          </View>

          <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.description}>
            Used locally to calculate precise Fajr to Isha times and Qibla bearing. Never leaves
            your device.
          </AppText>
        </View>
      </View>

      {/* Selected Location Pill */}
      <View style={[styles.locationBox, { backgroundColor: theme.colors.surfaceElevated }]}>
        <View style={styles.locationLeft}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="9" stroke={theme.colors.primary} strokeWidth="2" />
              <Path d="M8 12L11 15L16 9" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          )}

          <AppText variant="titleSmall" color={theme.colors.text} numberOfLines={1} style={styles.locationText}>
            {location.city}, {location.country}
          </AppText>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: permissionDenied ? theme.colors.border : theme.colors.mintTint }]}>
          <AppText variant="caption" color={permissionDenied ? theme.colors.textMuted : theme.colors.primary} style={styles.statusBadgeText}>
            {isLoading ? 'Locating...' : permissionDenied ? 'Permission Needed' : 'GPS Locked'}
          </AppText>
        </View>
      </View>

      {/* Action Button */}
      <LocationActionButtons
        isLoading={isLoading}
        permissionDenied={permissionDenied}
        onRequestGps={onRequestGps}
        onOpenSettings={onOpenSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    gap: SPACING.xs,
  },
  headingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: '700',
  },
  gpsBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  gpsBadgeText: {
    fontWeight: '700',
    fontSize: 11,
  },
  description: {
    lineHeight: 18,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  locationText: {
    fontWeight: '700',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: {
    fontWeight: '700',
    fontSize: 11,
  },
});
