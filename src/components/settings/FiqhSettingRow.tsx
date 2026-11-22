import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { FiqhName } from '@/types';
import { getFiqhDetails } from '@/constants/fiqh';

export interface FiqhSettingRowProps {
  fiqh: FiqhName;
  onPress: () => void;
}

export const FiqhSettingRow: React.FC<FiqhSettingRowProps> = ({ fiqh, onPress }) => {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const details = getFiqhDetails(fiqh);

  const displayTitle = language === 'ar' ? details.titleAr : language === 'ur' ? details.titleUr : details.titleEn;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${t('fiqh')}: ${displayTitle}`}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }]}
    >
      <View style={styles.leftRow}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.accentTint }]}>
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="5" stroke={theme.colors.accent} strokeWidth="2" />
            <Path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke={theme.colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </View>
        <View style={styles.textCol}>
          <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
            {t('fiqh')}
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
            {t('asrJuristicPreference')}
          </AppText>
        </View>
      </View>
      <View style={styles.rightGroup}>
        <View style={[styles.pillBadge, { backgroundColor: theme.colors.secondaryTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.pillText}>
            {displayTitle}
          </AppText>
        </View>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
          <Path
            d="M9 18l6-6-6-6"
            stroke={theme.colors.textSecondary}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textCol: {
    flex: 1,
  },
  rowTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
  },
  pillText: {
    fontWeight: '700',
    fontSize: 11,
  },
  chevron: {
    marginLeft: 2,
  },
});

