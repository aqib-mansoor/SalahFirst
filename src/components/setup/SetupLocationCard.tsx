import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { UserLocation } from '@/types';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { LocationActionButtons } from './LocationActionButtons';

export interface SetupLocationCardProps {
  location: UserLocation | null;
  isLoading: boolean;
  permissionDenied: boolean;
  onRequestGps: () => void;
  onOpenSettings: () => void;
  onSelectCityManually?: () => void;
}

export const SetupLocationCard: React.FC<SetupLocationCardProps> = ({
  location,
  isLoading,
  permissionDenied,
  onRequestGps,
  onOpenSettings,
  onSelectCityManually,
}) => {
  const theme = useTheme();

  const getStatusBadge = () => {
    if (isLoading) {
      return { text: 'Locating...', bg: theme.colors.mintTint, color: theme.colors.primary };
    }
    if (location) {
      return location.isGps
        ? { text: 'GPS Locked', bg: theme.colors.mintTint, color: theme.colors.primary }
        : { text: 'Manual City', bg: theme.colors.mintTint, color: theme.colors.primary };
    }
    if (permissionDenied) {
      return { text: 'Permission Needed', bg: theme.colors.border, color: theme.colors.textMuted };
    }
    return { text: 'Location Not Set', bg: theme.colors.border, color: theme.colors.textMuted };
  };

  const status = getStatusBadge();

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
                {location && !location.isGps ? 'Manual' : 'Auto GPS'}
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
      <Pressable
        onPress={onSelectCityManually}
        disabled={!onSelectCityManually}
        style={({ pressed }) => [
          styles.locationBox,
          {
            backgroundColor: theme.colors.surfaceElevated,
            opacity: pressed && onSelectCityManually ? 0.85 : 1,
          },
        ]}
      >
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
            {location
              ? `${location.city}${location.country ? `, ${location.country}` : ''}`
              : permissionDenied
              ? 'Select city manually...'
              : 'Detecting GPS Location...'}
          </AppText>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <AppText variant="caption" color={status.color} style={styles.statusBadgeText}>
            {status.text}
          </AppText>
        </View>
      </Pressable>

      {/* Action Button */}
      <LocationActionButtons
        isLoading={isLoading}
        permissionDenied={permissionDenied}
        onRequestGps={onRequestGps}
        onOpenSettings={onOpenSettings}
        onSelectCityManually={onSelectCityManually}
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
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    lineHeight: 18,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
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
    flex: 1,
    fontWeight: '600',
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
