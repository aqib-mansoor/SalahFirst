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

  const primaryAccent = isAligned ? theme.colors.accent : theme.colors.primary;

  return (
    <View
      style={[
        styles.guidancePill,
        {
          backgroundColor: isAligned ? theme.colors.accentTint : theme.colors.surface,
          borderColor: isAligned ? theme.colors.accent : theme.colors.border,
        },
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: isAligned ? theme.colors.accent : theme.colors.secondaryTint }]}>
        {isAligned ? (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17L4 12"
              stroke="#071812"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : turnDirection === 'left' ? (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              stroke={theme.colors.primary}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M14 5l7 7m0 0l-7 7m7-7H3"
              stroke={theme.colors.primary}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>

      <AppText
        variant="bodySmall"
        color={isAligned ? theme.colors.text : theme.colors.text}
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
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    maxWidth: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidanceText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
