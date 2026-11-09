import React, { useMemo } from 'react';
import { StyleSheet, View, Modal, Pressable, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';
import { PresetCity } from '@/data';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { carryOverPrayers } from '@/store/slices/prayerSlice';
import { getPrayerTimes, getDefaultMethodForCountry, getDefaultMadhabForCountry } from '@/utils/prayerTimes';
import { resolveTimezone, calculateLocationTimeDiff } from '@/utils/timezone';
import { LocationChangeBreakdownCard } from './LocationChangeBreakdownCard';

export interface LocationChangeConfirmModalProps {
  visible: boolean;
  currentCityName: string;
  currentCountry?: string;
  currentTimezone?: string;
  destinationCity: PresetCity | null;
  onConfirm: (city: PresetCity) => void;
  onCancel: () => void;
}

export const LocationChangeConfirmModal: React.FC<LocationChangeConfirmModalProps> = ({
  visible,
  currentCityName,
  currentCountry,
  currentTimezone,
  destinationCity,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const {
    calcMethod: reduxMethod,
    juristic: reduxJuristic,
    historyMap,
  } = useAppSelector((state) => state.prayer);

  const destTz = useMemo(() => {
    if (!destinationCity) return 'UTC';
    try {
      return (
        destinationCity.timezone ||
        resolveTimezone(destinationCity.latitude, destinationCity.longitude, destinationCity.country)
      );
    } catch {
      return 'UTC';
    }
  }, [destinationCity]);

  const timeDiff = useMemo(() => {
    if (!destinationCity) return null;
    return calculateLocationTimeDiff(destTz, currentTimezone);
  }, [destTz, currentTimezone, destinationCity]);

  const calcMethod = reduxMethod || getDefaultMethodForCountry(destinationCity?.country);
  const juristic = reduxJuristic || getDefaultMadhabForCountry(destinationCity?.country);

  const destPrayerTimes = useMemo(() => {
    if (!destinationCity) return null;
    return getPrayerTimes(
      destinationCity.latitude,
      destinationCity.longitude,
      new Date(),
      calcMethod,
      juristic,
      destTz
    );
  }, [destinationCity, calcMethod, juristic, destTz]);

  if (!destinationCity || !timeDiff || !destPrayerTimes) {
    return null;
  }

  const todayCompleted = historyMap[timeDiff.currentDateKey] || {};

  const handleConfirm = () => {
    if (timeDiff.destDateKey !== timeDiff.currentDateKey) {
      dispatch(
        carryOverPrayers({
          fromDateKey: timeDiff.currentDateKey,
          toDateKey: timeDiff.destDateKey,
        })
      );
    }
    onConfirm(destinationCity);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={[styles.dialog, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Top Icon Badge */}
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.secondaryTint }]}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 21C16 16.5 19 12.8 19 9A7 7 0 105 9c0 3.8 3 7.5 7 12z"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            {/* Title & Subtitle */}
            <AppText variant="titleMedium" color={theme.colors.textPrimary} align="center" style={styles.title}>
              Change Location
            </AppText>
            <AppText variant="bodySmall" color={theme.colors.textSecondary} align="center" style={styles.subtitle}>
              Switch prayer calculations and schedule to {destinationCity.name}
            </AppText>

            {/* Comprehensive Information Breakdown */}
            <LocationChangeBreakdownCard
              currentCityName={currentCityName}
              currentCountry={currentCountry}
              destinationCity={destinationCity}
              timeDiff={timeDiff}
              destPrayerTimes={destPrayerTimes}
              todayCompleted={todayCompleted}
            />

            {/* Actions */}
            <View style={styles.actionGroup}>
              <AppButton
                label={`Switch to ${destinationCity.name}`}
                onPress={handleConfirm}
                variant="primary"
                style={{ width: '100%' }}
              />
              <AppButton
                label={`Keep ${currentCityName}`}
                onPress={onCancel}
                variant="ghost"
                style={{ width: '100%' }}
              />
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  scrollContent: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginBottom: SPACING.xs,
  },
  actionGroup: {
    width: '100%',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
});
