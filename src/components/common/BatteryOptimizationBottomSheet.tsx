import React from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { SPACING, RADIUS } from '@/constants/theme';
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
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  if (!visible) return null;

  const bottomPadding = Math.max(insets.bottom, SPACING.md) + SPACING.xs;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onDismiss}
          accessibilityLabel="Dismiss dialog"
        />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: bottomPadding,
            },
          ]}
        >
          {/* Top Handle Bar */}
          <View style={[styles.handleBar, { backgroundColor: theme.colors.border }]} />

          {/* Header with Shield Icon & Title */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondaryTint }]}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M9 12l2 2 4-4"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <View style={styles.headerText}>
              <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
                {t('batterySheetTitle')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
                {t('batterySheetSubtitle')}
              </AppText>
            </View>
          </View>

          {/* Value Points */}
          <View style={[styles.pointsContainer, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
            {/* Point 1 */}
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

            {/* Separator */}
            <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

            {/* Point 2 */}
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

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={t('batterySheetPrimaryBtn')}
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <AppText variant="titleSmall" color={theme.colors.textOnPrimary} style={styles.btnText}>
                {t('batterySheetPrimaryBtn')}
              </AppText>
            </Pressable>

            <Pressable
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel={t('batterySheetSecondaryBtn')}
              style={({ pressed }) => [
                styles.secondaryBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <AppText variant="caption" color={theme.colors.textMuted} style={styles.secondaryBtnText}>
                {t('batterySheetSecondaryBtn')}
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  pointsContainer: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
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
  pointTextContainer: {
    flex: 1,
    gap: 2,
  },
  pointTitle: {
    fontWeight: '700',
    fontSize: 12,
  },
  pointDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  separator: {
    height: 1,
    marginVertical: 2,
  },
  actions: {
    gap: SPACING.xs,
    paddingTop: SPACING.xs,
  },
  primaryBtn: {
    paddingVertical: 13,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
