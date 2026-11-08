import React from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';

export interface TasbihResetModalProps {
  visible: boolean;
  count: number;
  target: number;
  dhikrName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TasbihResetModal: React.FC<TasbihResetModalProps> = ({
  visible,
  count,
  target,
  dhikrName,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={[
            styles.dialog,
            {
              backgroundColor: theme.colors.surface,
              borderColor: 'rgba(243, 196, 64, 0.40)',
            },
          ]}
        >
          {/* Top Misbaha Reset Emblem */}
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.secondaryTint }]}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                stroke={theme.colors.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M3 3v5h5"
                stroke={theme.colors.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Title & Message */}
          <AppText variant="titleMedium" color={theme.colors.textPrimary} align="center" style={styles.title}>
            Reset Dhikr Counter?
          </AppText>

          <AppText variant="bodySmall" color={theme.colors.textSecondary} align="center" style={styles.subtitle}>
            Are you sure you want to reset your current recitation progress back to zero?
          </AppText>

          {/* Active Recitation Status Box */}
          <View style={[styles.statusBox, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
            <View style={styles.statusRow}>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Current Dhikr:
              </AppText>
              <AppText variant="caption" color={theme.colors.primary} style={styles.dhikrBold}>
                {dhikrName}
              </AppText>
            </View>

            <View style={styles.statusRow}>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Recorded Count:
              </AppText>
              <AppText variant="caption" color={theme.colors.accent} style={styles.countBold}>
                {count} / {target} beads
              </AppText>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.buttonCol}>
            <AppButton
              label="Keep Counting"
              onPress={onCancel}
              variant="gold"
              size="md"
              style={styles.keepBtn}
            />

            <AppButton
              label="Reset to Zero"
              onPress={onConfirm}
              variant="ghost"
              size="md"
              textColor={theme.colors.error}
              style={styles.resetBtn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: RADIUS.xxl,
    borderWidth: 1.2,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm + 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  iconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    lineHeight: 19,
    paddingHorizontal: SPACING.xs,
  },
  statusBox: {
    width: '100%',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.xs,
    marginVertical: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dhikrBold: {
    fontWeight: '700',
  },
  countBold: {
    fontWeight: '800',
  },
  buttonCol: {
    width: '100%',
    gap: SPACING.xs,
    marginTop: 4,
  },
  keepBtn: {
    width: '100%',
  },
  resetBtn: {
    width: '100%',
  },
});

