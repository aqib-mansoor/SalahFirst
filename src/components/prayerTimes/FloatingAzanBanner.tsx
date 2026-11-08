import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface FloatingAzanBannerProps {
  visible: boolean;
  prayerName: string | null;
  onStop: () => void;
}

export const FloatingAzanBanner: React.FC<FloatingAzanBannerProps> = ({
  visible,
  prayerName,
  onStop,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  if (!visible || !prayerName) return null;

  return (
    <View
      style={[
        styles.container,
        {
          top: insets.top + SPACING.sm,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.primary,
          shadowColor: theme.colors.text,
        },
      ]}
    >
      <View style={styles.leftGroup}>
        <View style={[styles.iconPill, { backgroundColor: theme.colors.secondaryTint }]}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M11 5L6 9H2v6h4l5 4V5z"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M15.54 8.46a5 5 0 0 1 0 7.07"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M19.07 4.93a10 10 0 0 1 0 14.14"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <View style={styles.textColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.prayerTitle}>
            {`${prayerName} ${t('azan') || 'Azan'}`}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.recitingSubtitle}>
            {t('azanReciting') || 'Azan is reciting...'}
          </AppText>
        </View>
      </View>

      <Pressable
        onPress={onStop}
        accessibilityRole="button"
        accessibilityLabel={t('stopAzan') || 'Stop Azan'}
        style={({ pressed }) => [
          styles.stopBtn,
          {
            backgroundColor: pressed ? theme.colors.error : theme.colors.surfaceElevated,
            borderColor: theme.colors.error,
          },
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 6h12v12H6z"
            fill={theme.colors.error}
          />
        </Svg>
        <AppText variant="caption" color={theme.colors.error} style={styles.stopText}>
          {t('stopAzan') || 'Silence'}
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    gap: SPACING.sm,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  prayerTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  recitingSubtitle: {
    fontSize: 11,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  stopText: {
    fontWeight: '700',
    fontSize: 11,
  },
});
