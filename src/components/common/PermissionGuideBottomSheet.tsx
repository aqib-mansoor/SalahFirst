import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';
import {
  PermissionKey,
  openPermissionSettingsByKey,
} from '@/native/FocusBlockerBridge';
import { PERMISSION_GUIDES } from '@/constants/permissionGuides';

export interface PermissionGuideBottomSheetProps {
  visible: boolean;
  permissionKey: PermissionKey | null;
  onClose: () => void;
  onSettingsOpened?: () => void;
}

export const PermissionGuideBottomSheet: React.FC<PermissionGuideBottomSheetProps> = ({
  visible,
  permissionKey,
  onClose,
  onSettingsOpened,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [visible, slideAnim]);

  if (!visible || !permissionKey) return null;
  const guide = PERMISSION_GUIDES[permissionKey];
  if (!guide) return null;

  const handleOpenSettings = async () => {
    await openPermissionSettingsByKey(permissionKey);
    onSettingsOpened?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 16) + 12,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Top handle pill */}
          <View style={styles.handleContainer}>
            <View style={[styles.handlePill, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <View style={[styles.badge, { backgroundColor: theme.colors.mintTint }]}>
                <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
                  {guide.badge}
                </AppText>
              </View>
              <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
                {guide.title}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted} style={styles.tagline}>
                {guide.tagline}
              </AppText>
            </View>
          </View>

          {/* Why needed callout */}
          <View
            style={[
              styles.whyCard,
              { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border },
            ]}
          >
            <AppText variant="bodySmall" color={theme.colors.text} style={styles.whyText}>
              {guide.whyNeeded}
            </AppText>
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.stepsHeading}>
              HOW TO ENABLE IN 3 STEPS:
            </AppText>

            {guide.steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={[styles.stepNumberBadge, { backgroundColor: theme.colors.primary }]}>
                  <AppText variant="caption" color="#FFFFFF" style={styles.stepNum}>
                    {idx + 1}
                  </AppText>
                </View>
                <AppText variant="bodySmall" color={theme.colors.text} style={styles.stepLabel}>
                  {step}
                </AppText>
              </View>
            ))}
          </View>

          {/* Direct CTA */}
          <View style={styles.footerActions}>
            <AppButton
              label={guide.ctaLabel}
              onPress={handleOpenSettings}
              size="lg"
              style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
            />
            <Pressable onPress={onClose} style={styles.laterButton}>
              <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.laterText}>
                Not now
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    gap: SPACING.md,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  handlePill: {
    width: 38,
    height: 4.5,
    borderRadius: RADIUS.full,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextCol: {
    gap: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginBottom: 2,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
  },
  title: {
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: -0.2,
  },
  tagline: {
    fontSize: 12,
  },
  whyCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  whyText: {
    lineHeight: 18,
    fontSize: 12.5,
  },
  stepsContainer: {
    gap: SPACING.sm,
  },
  stepsHeading: {
    fontWeight: '700',
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
  },
  stepNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  stepLabel: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '500',
  },
  footerActions: {
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  ctaButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    minHeight: 50,
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  laterText: {
    fontWeight: '600',
    fontSize: 12.5,
  },
});

