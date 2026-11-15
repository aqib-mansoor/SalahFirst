import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { AppBottomSheet } from './AppBottomSheet';
import { SPACING, RADIUS } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useTranslation } from '@/context/LocalizationContext';

export interface BatteryOptimizationBottomSheetProps {
  visible: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export const BatteryOptimizationBottomSheet: React.FC<BatteryOptimizationBottomSheetProps> = ({
  visible,
  onConfirm,
  onDismiss,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={theme.colors.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={theme.colors.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onDismiss}
      showCloseButton={false}
      title={t('batterySheetTitle')}
      badgeText={`v${APP_CONFIG.version}`}
      subtitleText={t('batterySheetSubtitle')}
      icon={headerIcon}
    >
      <View
        style={[
          styles.pointsContainer,
          {
            backgroundColor: theme.isDark
              ? theme.colors.surfaceSubtle
              : theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.pointRow}>
          <View style={[styles.checkCircle, { backgroundColor: theme.colors.secondaryTint }]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <View style={styles.pointTextContainer}>
            <AppText variant="caption" color={theme.colors.text} style={styles.pointTitle}>
              {t('batterySheetPoint1Title')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.pointDesc}>
              {t('batterySheetPoint1Desc')}
            </AppText>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

        <View style={styles.pointRow}>
          <View style={[styles.checkCircle, { backgroundColor: theme.colors.secondaryTint }]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={styles.pointTextContainer}>
            <AppText variant="caption" color={theme.colors.text} style={styles.pointTitle}>
              {t('batterySheetPoint2Title')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.pointDesc}>
              {t('batterySheetPoint2Desc')}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onConfirm}
          accessibilityRole="button"
          accessibilityLabel={t('batterySheetPrimaryBtn')}
          style={({ pressed }) => [
            styles.primaryBtn,
            { backgroundColor: theme.colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <AppText variant="bodyMedium" color={theme.colors.textOnPrimary} style={styles.btnText}>
            {t('batterySheetPrimaryBtn')}
          </AppText>
        </Pressable>

        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t('batterySheetSecondaryBtn')}
          style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.secondaryBtnText}>
            {t('batterySheetSecondaryBtn')}
          </AppText>
        </Pressable>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  pointsContainer: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm + 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pointTextContainer: { flex: 1, gap: 2 },
  pointTitle: { fontWeight: '700', fontSize: 12 },
  pointDesc: { fontSize: 11, lineHeight: 15 },
  separator: { height: 1, marginVertical: 2 },
  actions: { gap: SPACING.xs },
  primaryBtn: {
    height: 46,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontWeight: '700', letterSpacing: 0.3 },
  secondaryBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 12, fontWeight: '500' },
});
