import React from 'react';
import { StyleSheet, View, Pressable, Platform, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as IntentLauncher from 'expo-intent-launcher';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export const BatteryOptimizationCard: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (Platform.OS !== 'android') return null;

  const handleOpenBatterySettings = async () => {
    try {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS
      );
    } catch {
      Linking.openSettings();
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: theme.colors.surfaceElevated },
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke={theme.colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 8v4M12 16h.01"
              stroke={theme.colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <View style={styles.textColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
            {t('batteryOptTitle')}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
            {t('batteryOptDesc')}
          </AppText>
        </View>
      </View>

      <Pressable
        onPress={handleOpenBatterySettings}
        accessibilityRole="button"
        accessibilityLabel={t('batteryOptButton')}
        style={({ pressed }) => [
          styles.actionBtn,
          {
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surfaceElevated,
            borderColor: theme.colors.accent,
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.accent} style={styles.actionBtnText}>
          {t('batteryOptButton')}
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  boldText: {
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  actionBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginTop: 2,
  },
  actionBtnText: {
    fontWeight: '700',
    fontSize: 11,
  },
});

