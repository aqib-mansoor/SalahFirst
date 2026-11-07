import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface AzanPrefsHeaderProps {
  onBack: () => void;
}

export const AzanPrefsHeader: React.FC<AzanPrefsHeaderProps> = ({ onBack }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back to prayer times"
        style={[styles.backBtn, { borderColor: theme.colors.border }]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 18l-6-6 6-6"
            stroke={theme.colors.text}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <View style={styles.headerTextCol}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
          {t('notificationsAndReminders')}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {t('customizeAlerts')}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
  },
});
