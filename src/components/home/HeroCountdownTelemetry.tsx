import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Theme } from '@/constants/theme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HeroCountdownTelemetryProps {
  theme: Theme;
  localizedNextPrayer: string;
  arabicPrayer: string;
  countdownText: string;
  nextPrayerTimeFormatted: string;
}

/**
 * HeroCountdownTelemetry
 * Standalone Card 1: Clean, mature next prayer telemetry.
 * Displays upcoming prayer label, Arabic script, large countdown, and vector-icon Azan time.
 */
export const HeroCountdownTelemetry: React.FC<HeroCountdownTelemetryProps> = ({
  theme,
  localizedNextPrayer,
  arabicPrayer,
  countdownText,
  nextPrayerTimeFormatted,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Top Header: Clean Unboxed Next Prayer Meta & Name */}
      <View style={styles.headerBlock}>
        <AppText
          variant="caption"
          color={theme.colors.accentLight}
          style={styles.upcomingMeta}
          numberOfLines={1}
        >
          {t('nextPrayer').toUpperCase()}
        </AppText>

        <View style={styles.prayerTitleRow}>
          <AppText
            color={theme.colors.textOnPrimary}
            style={styles.prayerNameText}
            numberOfLines={1}
          >
            {localizedNextPrayer}
          </AppText>

          {arabicPrayer ? (
            <AppText
              color={theme.colors.accent}
              style={styles.arabicNameText}
              numberOfLines={1}
            >
              • {arabicPrayer}
            </AppText>
          ) : null}
        </View>
      </View>

      {/* Centerpiece: Clean Tabular Countdown Timer */}
      <View style={styles.centerSection}>
        <AppText color={theme.colors.textOnPrimary} style={styles.countdownNumber} numberOfLines={1}>
          {countdownText}
        </AppText>
      </View>

      {/* Bottom: Clean Inline Azan Time with crisp vector bell */}
      <View style={styles.azanRow}>
        <Svg width={11} height={11} viewBox="0 0 24 24" fill={theme.colors.accent}>
          <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
        </Svg>

        <AppText
          variant="caption"
          color="rgba(255, 255, 255, 0.72)"
          style={styles.azanLabel}
          numberOfLines={1}
        >
          {t('azanTime')}:
        </AppText>

        <AppText
          variant="caption"
          color={theme.colors.textOnPrimary}
          style={styles.azanValue}
          numberOfLines={1}
        >
          {nextPrayerTimeFormatted}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  headerBlock: {
    gap: 1,
    width: '100%',
  },
  upcomingMeta: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  prayerTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  prayerNameText: {
    fontWeight: '800',
    fontSize: 16.5,
    letterSpacing: 0.2,
  },
  arabicNameText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  centerSection: {
    paddingVertical: 2,
    width: '100%',
  },
  countdownNumber: {
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  azanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
  },
  azanLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  azanValue: {
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
