import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable, Platform, Linking, AppState, AppStateStatus } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import {
  isIgnoringBatteryOptimizations,
  requestIgnoreBatteryOptimizations,
} from '@/native/AzanServiceModule';

export const BatteryOptimizationCard: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isUnrestricted, setIsUnrestricted] = useState<boolean>(true);

  const checkBatteryStatus = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    const ignoring = await isIgnoringBatteryOptimizations();
    setIsUnrestricted(ignoring);
  }, []);

  useEffect(() => {
    checkBatteryStatus();

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        checkBatteryStatus();
      }
    });
    return () => sub.remove();
  }, [checkBatteryStatus]);

  // Auto-hide on iOS or once battery optimization is already "Unrestricted"
  if (Platform.OS !== 'android' || isUnrestricted) return null;

  const handleOpenBatterySettings = async () => {
    const success = await requestIgnoreBatteryOptimizations();
    if (!success) {
      await Linking.openSettings().catch(() => {});
    }
    setTimeout(checkBatteryStatus, 600);
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
            { backgroundColor: theme.colors.secondaryTint },
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 8v4M12 16h.01"
              stroke={theme.colors.primary}
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
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surfaceSubtle,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.primary} style={styles.actionBtnText}>
          {t('batteryOptButton')}
        </AppText>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 18l6-6-6-6"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  actionBtnText: {
    fontWeight: '600',
    fontSize: 12,
  },
});
