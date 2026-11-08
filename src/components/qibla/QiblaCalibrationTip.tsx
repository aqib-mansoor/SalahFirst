import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface QiblaCalibrationTipProps {
  needsCalibration?: boolean;
  hasSensor?: boolean;
}

export const QiblaCalibrationTip: React.FC<QiblaCalibrationTipProps> = ({
  needsCalibration = false,
  hasSensor = true,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // If sensor is working normally with no interference, keep screen clean and minimal
  if (!needsCalibration && hasSensor) {
    return null;
  }

  const tipText = !hasSensor
    ? (t('sensorUnavailable') || 'Magnetometer sensor unavailable. Showing calculated bearing.')
    : (t('magneticInterference') || 'Magnetic interference detected. Wave phone in a figure-8 motion away from metal objects.');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.accent,
        },
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surfaceElevated }]}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 4V9H4.582M20 20V15H19.418M19.938 9C19.488 5.61 16.592 3 13 3C9.134 3 6 6.134 6 10C6 11.5 6.47 12.89 7.276 14.04M4.062 15C4.512 18.39 7.408 21 11 21C14.866 21 18 17.866 18 14C18 12.5 17.53 11.11 16.724 9.96"
            stroke={theme.colors.accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      <View style={styles.textColumn}>
        <AppText variant="caption" color={theme.colors.accent} style={styles.alertHeading}>
          {t('recalibrateCompass') || 'Calibration Needed'}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.tipText}>
          {tipText}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  alertHeading: {
    fontWeight: '700',
    fontSize: 11,
  },
  tipText: {
    lineHeight: 16,
    fontSize: 11,
  },
});
