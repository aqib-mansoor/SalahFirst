import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { TurnDirection } from '@/hooks/useQiblaCompass';

export interface QiblaGuidancePillProps {
  isAligned: boolean;
  turnDirection: TurnDirection;
  turnDegrees: number;
}

export const QiblaGuidancePill: React.FC<QiblaGuidancePillProps> = ({
  isAligned,
  turnDirection,
  turnDegrees,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const guidanceText = isAligned
    ? t('facingKaaba')
    : turnDirection === 'left'
    ? (t('turnLeftDegrees', { degrees: turnDegrees }) || `Turn left ${turnDegrees}°`)
    : (t('turnRightDegrees', { degrees: turnDegrees }) || `Turn right ${turnDegrees}°`);

  return (
    <View
      style={[
        styles.guidancePill,
        {
          backgroundColor: isAligned
            ? theme.colors.secondaryTint
            : theme.colors.surface,
          borderColor: isAligned
            ? theme.colors.primary
            : theme.colors.border,
        },
      ]}
    >
      {isAligned ? (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 6L9 17L4 12"
            stroke={theme.colors.primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : turnDirection === 'left' ? (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
            stroke={theme.colors.primary}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M14 5l7 7m0 0l-7 7m7-7H3"
            stroke={theme.colors.primary}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
      <AppText
        variant="bodySmall"
        color={isAligned ? theme.colors.primary : theme.colors.text}
        style={styles.guidanceText}
        numberOfLines={1}
      >
        {guidanceText}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  guidancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    maxWidth: 320,
  },
  guidanceText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
