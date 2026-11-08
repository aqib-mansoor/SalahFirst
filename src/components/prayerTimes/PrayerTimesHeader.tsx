import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { useHijriDate } from '@/hooks/useHijriDate';

export interface PrayerTimesHeaderProps {
  onOpenAzanPrefs: () => void;
  countryName?: string;
}

export const PrayerTimesHeader: React.FC<PrayerTimesHeaderProps> = ({
  onOpenAzanPrefs,
  countryName,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { hijriDateFormatted } = useHijriDate(countryName);
  const gregorianDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.titleColumn}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
          {t('prayerTimes')}
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.dateSubtitle}>
          {gregorianDate} • {hijriDateFormatted}
        </AppText>
      </View>

      <Pressable
        onPress={onOpenAzanPrefs}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Azan Preferences"
        accessibilityHint="Opens notification sound and alert configuration"
        style={({ pressed }) => [
          styles.prefsButton,
          {
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
            borderColor: theme.colors.border,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.buttonTextColumn}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.prefsText}>
            Azan
          </AppText>
          <AppText variant="caption" color={theme.colors.primary} style={styles.prefsText}>
            Prefs
          </AppText>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  titleColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
  },
  dateSubtitle: {
    lineHeight: 18,
  },
  prefsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  buttonTextColumn: {
    alignItems: 'flex-start',
  },
  prefsText: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 13,
  },
});

