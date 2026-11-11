import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Pressable, AppState, AppStateStatus } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';
import {
  checkBlockerPermissions,
  openOverlaySettings,
  openAccessibilitySettings,
  BlockerPermissionsStatus,
} from '@/native/FocusBlockerBridge';

export interface FocusPermissionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAllGranted: () => void;
}

export const FocusPermissionModal: React.FC<FocusPermissionModalProps> = ({
  visible,
  onDismiss,
  onAllGranted,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<BlockerPermissionsStatus>({
    overlay: false,
    accessibility: false,
    isReady: false,
  });

  const refreshStatus = async () => {
    const s = await checkBlockerPermissions();
    setStatus(s);
    if (s.isReady) {
      onAllGranted();
    }
  };

  useEffect(() => {
    if (visible) refreshStatus();
  }, [visible]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active' && visible) {
        refreshStatus();
      }
    });
    return () => sub.remove();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(SPACING.xl, insets.bottom + SPACING.md),
            },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: theme.colors.secondaryTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
              SALAH SHIELD PERMISSION
            </AppText>
          </View>

          <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
            Enable Distraction Lockout
          </AppText>

          <AppText variant="bodyMedium" color={theme.colors.textSecondary} style={styles.desc}>
            To display Quranic reminders and lock out TikTok, Instagram, and social media while you pray,
            Android requires two system permissions:
          </AppText>

          {/* Step 1: Overlay */}
          <Pressable
            style={[
              styles.stepRow,
              {
                backgroundColor: status.overlay ? theme.colors.secondaryTint : theme.colors.surfaceSubtle,
                borderColor: status.overlay ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={status.overlay ? undefined : openOverlaySettings}
          >
            <View style={styles.stepInfo}>
              <AppText variant="titleSmall" color={theme.colors.text}>
                1. Display Over Other Apps
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Allows Quranic lockout modal to appear over social apps
              </AppText>
            </View>
            <View
              style={[
                styles.actionPill,
                { backgroundColor: status.overlay ? theme.colors.primary : theme.colors.accent },
              ]}
            >
              <AppText
                variant="caption"
                color={status.overlay ? theme.colors.surface : theme.colors.textOnAccent}
                style={styles.actionText}
              >
                {status.overlay ? 'Granted ✓' : 'Enable'}
              </AppText>
            </View>
          </Pressable>

          {/* Step 2: Accessibility */}
          <Pressable
            style={[
              styles.stepRow,
              {
                backgroundColor: status.accessibility ? theme.colors.secondaryTint : theme.colors.surfaceSubtle,
                borderColor: status.accessibility ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={status.accessibility ? undefined : openAccessibilitySettings}
          >
            <View style={styles.stepInfo}>
              <AppText variant="titleSmall" color={theme.colors.text}>
                2. Accessibility Service
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Detects when TikTok or Reels are opened during prayer
              </AppText>
            </View>
            <View
              style={[
                styles.actionPill,
                { backgroundColor: status.accessibility ? theme.colors.primary : theme.colors.accent },
              ]}
            >
              <AppText
                variant="caption"
                color={status.accessibility ? theme.colors.surface : theme.colors.textOnAccent}
                style={styles.actionText}
              >
                {status.accessibility ? 'Granted ✓' : 'Enable'}
              </AppText>
            </View>
          </Pressable>

          <View style={styles.buttonRow}>
            <AppButton label="Cancel" variant="outline" onPress={onDismiss} style={styles.btnCancel} />
            <AppButton
              label={status.isReady ? 'Start Focus' : 'Check Status'}
              variant="primary"
              onPress={status.isReady ? onAllGranted : refreshStatus}
              style={styles.btnAction}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  desc: {
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  stepInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  actionPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  actionText: {
    fontWeight: '700',
    fontSize: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  btnCancel: {
    flex: 1,
  },
  btnAction: {
    flex: 1,
  },
});
