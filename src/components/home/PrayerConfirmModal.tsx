import React from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
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
        <Pressable style={[styles.dialog, { backgroundColor: theme.colors.surface }]}>
          {/* Top Mosque / Crescent Icon */}
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.mintTint }]}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2C8 6 6 9 6 13C6 16.31 8.69 19 12 19C15.31 19 18 16.31 18 13C18 9 16 6 12 2Z"
                stroke={PALETTE.emeraldDark}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 13V19M9 19H15"
                stroke={PALETTE.emeraldDark}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Title & Question */}
          <AppText variant="titleMedium" color={theme.colors.text} align="center" style={styles.title}>
            Confirm {localizedPrayer} Salah
          </AppText>

          <AppText variant="bodyMedium" color={theme.colors.textMuted} align="center" style={styles.subtitle}>
            Have you completed your {localizedPrayer} prayer today?
          </AppText>

          {/* Sincerity & Honesty Callout Box */}
          <View style={styles.honestyCallout}>
            <View style={styles.ayahBox}>
              <AppText variant="caption" align="center" style={styles.ayahText}>
                "وَكَانَ اللَّهُ بِمَا تَعْمَلُونَ عَلِيمًا"
              </AppText>
              <AppText variant="caption" align="center" style={styles.ayahTranslation}>
                "And Allah is ever knowing of what you do." (4:128)
              </AppText>
            </View>

            <AppText variant="caption" align="center" style={styles.honestyNote}>
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
              textColor={theme.colors.textMuted}
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
    padding: SPACING.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
    backgroundColor: '#FEF9EE',
    borderColor: '#F3E8CE',
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
    color: PALETTE.goldDark,
    fontWeight: '700',
    fontSize: 13,
  },
  ayahTranslation: {
    color: '#854D0E',
    fontStyle: 'italic',
    fontSize: 11,
  },
  honestyNote: {
    color: '#713F12',
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
  },
  cancelBtn: {
    width: '100%',
    minHeight: 40,
  },
});

