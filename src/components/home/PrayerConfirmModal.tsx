import React from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrayerConfirmModalProps {
  visible: boolean;
  prayerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PrayerConfirmModal: React.FC<PrayerConfirmModalProps> = ({
  visible,
  prayerName,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const localizedPrayer = (t(prayerName.toLowerCase() as any) as string) || prayerName;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.dialog, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {/* Top Mosque / Crescent Icon */}
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.secondaryTint }]}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2C8 6 6 9 6 13C6 16.31 8.69 19 12 19C15.31 19 18 16.31 18 13C18 9 16 6 12 2Z"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 13V19M9 19H15"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Title & Question */}
          <AppText variant="titleMedium" color={theme.colors.textPrimary} align="center" style={styles.title}>
            Confirm {localizedPrayer} Salah
          </AppText>

          <AppText variant="bodyMedium" color={theme.colors.textSecondary} align="center" style={styles.subtitle}>
            Have you completed your {localizedPrayer} prayer today?
          </AppText>

          {/* Sincerity & Honesty Callout Box */}
          <View style={[styles.honestyCallout, { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent }]}>
            <View style={styles.ayahBox}>
              <AppText variant="caption" align="center" color={theme.colors.textPrimary} style={styles.ayahText}>
                "وَكَانَ اللَّهُ بِمَا تَعْمَلُونَ عَلِيمًا"
              </AppText>
              <AppText variant="caption" align="center" color={theme.colors.textSecondary} style={styles.ayahTranslation}>
                "And Allah is ever knowing of what you do." (4:128)
              </AppText>
            </View>

            <AppText variant="caption" align="center" color={theme.colors.textPrimary} style={styles.honestyNote}>
              Be honest with yourself and Allah. Only mark as completed if you have genuinely offered this prayer.
            </AppText>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonCol}>
            <AppButton
              label={`Yes, I Prayed ${localizedPrayer}`}
              onPress={onConfirm}
              variant="gold"
              size="md"
              style={styles.confirmBtn}
            />

            <AppButton
              label="Not Yet / Cancel"
              onPress={onCancel}
              variant="ghost"
              size="md"
              textColor={theme.colors.textSecondary}
              style={styles.cancelBtn}
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  honestyCallout: {
    width: '100%',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.xs + 2,
    marginBottom: SPACING.lg,
  },
  ayahBox: {
    gap: 2,
  },
  ayahText: {
    fontWeight: '700',
    fontSize: 13,
  },
  ayahTranslation: {
    fontStyle: 'italic',
    fontSize: 11,
  },
  honestyNote: {
    lineHeight: 16,
    fontSize: 11.5,
    fontWeight: '500',
  },
  buttonCol: {
    width: '100%',
    gap: SPACING.xs,
  },
  confirmBtn: {
    width: '100%',
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: SPACING.md,
  },
  cancelBtn: {
    width: '100%',
    minHeight: 40,
  },
});
