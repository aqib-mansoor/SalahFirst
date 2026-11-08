import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface LocationGpsPinnedCardProps {
  isGps: boolean;
  onPress: () => void;
}

export const LocationGpsPinnedCard: React.FC<LocationGpsPinnedCardProps> = ({
  isGps,
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Use Live Device GPS"
      accessibilityState={{ selected: isGps }}
      style={({ pressed }) => [
        styles.gpsCard,
        {
          backgroundColor: isGps
            ? theme.colors.secondaryTint
            : pressed
            ? theme.colors.surfaceElevated
            : theme.colors.surface,
          borderColor: isGps ? theme.colors.primary : theme.colors.border,
          borderWidth: isGps ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.gpsIconBox, { backgroundColor: theme.colors.mintTint }]}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2v3M12 19v3M2 12h3M19 12h3M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.gpsInfo}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.gpsName}>
          {t('useLiveGps')}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.gpsText}>
          {t('automaticGps')}
        </AppText>
      </View>

      {isGps && (
        <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 13l4 4L19 7"
              stroke={theme.colors.textOnPrimary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    gap: SPACING.sm,
  },
  gpsIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsInfo: {
    flex: 1,
    gap: 1,
  },
  gpsName: {
    fontWeight: '700',
    fontSize: 13,
  },
  gpsText: {
    fontSize: 11,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

