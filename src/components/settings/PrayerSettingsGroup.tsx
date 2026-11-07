import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface PrayerSettingsGroupProps {
  cityName: string;
  country: string;
  juristicMethod: 'Hanafi' | 'Standard';
  onOpenLocation: () => void;
  onOpenAzanPrefs: () => void;
  onToggleJuristic: () => void;
}

export const PrayerSettingsGroup: React.FC<PrayerSettingsGroupProps> = ({
  cityName,
  country,
  juristicMethod,
  onOpenLocation,
  onOpenAzanPrefs,
  onToggleJuristic,
}) => {
  const theme = useTheme();

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={theme.colors.textSubtle} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSubtle} style={styles.sectionLabel}>
        PRAYER SETTINGS
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Location */}
        <Pressable onPress={onOpenLocation} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              Location
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {cityName}, {country}
            </AppText>
          </View>
          {ChevronRight}
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Calculation Method */}
        <View style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              Calculation Method
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              University of Islamic Sciences, Karachi
            </AppText>
          </View>
          <AppText variant="bodySmall" color={theme.colors.primary} style={styles.autoTag}>
            Auto
          </AppText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 3: Asr Juristic Preference */}
        <Pressable onPress={onToggleJuristic} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              Asr Juristic Preference
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Standard (Shafi'i/Maliki/Hanbali) or Hanafi
            </AppText>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: theme.colors.mintTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.pillText}>
              {juristicMethod}
            </AppText>
          </View>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 4: Azan Sounds & Notifications */}
        <Pressable onPress={onOpenAzanPrefs} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              Azan Sounds & Notifications
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Makkah Haram • 15m pre-reminder
            </AppText>
          </View>
          {ChevronRight}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs + 2,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  textCol: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.sm,
  },
  rowTitle: {
    fontWeight: '700',
  },
  autoTag: {
    fontWeight: '700',
  },
  pillBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  pillText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

