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
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: theme.colors.secondaryTint,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Authentic Islamic Jurisprudence Book Vector */}
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8 7h8M8 11h5"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.textCol}>
          <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
            {t('fiqh')}
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
            {t(details.descKey as any)}
          </AppText>
        </View>
      </View>
      <View style={styles.rightGroup}>
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.actionText}>
          {displayTitle}
        </AppText>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
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
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 1,
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
    gap: 4,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 12,
  },
  chevron: {
    marginLeft: 2,
  },
});

