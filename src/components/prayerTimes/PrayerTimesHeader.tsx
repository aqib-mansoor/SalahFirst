import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

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

  return (
    <View style={styles.container}>
      <View style={styles.titleColumn}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
          {t('prayerTimes')}
        </AppText>
        {countryName ? (
          <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>
            {countryName}
          </AppText>
        ) : null}
      </View>

      <Pressable
        onPress={onOpenAzanPrefs}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Azan Preferences"
        accessibilityHint="Opens notification sound and alert configuration"
        style={({ pressed }) => [
          styles.iconButton,
          {
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
            borderColor: theme.colors.border,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
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
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  titleColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});
