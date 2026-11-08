import React from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { AppText, AppButton } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface FocusExitEarlyModalProps {
  visible: boolean;
  prayerName: string;
  remainingSeconds: number;
  onStayFocused: () => void;
  onConfirmExit: () => void;
}

export const FocusExitEarlyModal: React.FC<FocusExitEarlyModalProps> = ({
  visible,
  prayerName,
  remainingSeconds,
  onStayFocused,
  onConfirmExit,
}) => {
  const { t } = useTranslation();
  if (!visible) return null;

  const minutesLeft = Math.max(1, Math.ceil(remainingSeconds / 60));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onStayFocused}
    >
      <Pressable style={styles.overlay} onPress={onStayFocused}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Top Mindful Shield Icon */}
          <View style={styles.iconCircle}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth={2}>
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </Svg>
          </View>

          {/* Title */}
          <AppText variant="titleMedium" color={PALETTE.white} align="center" style={styles.title}>
            Pause Salah Focus?
          </AppText>

          {/* Time Remaining Badge */}
          <View style={styles.badgePill}>
            <View style={styles.liveDot} />
            <AppText variant="caption" style={styles.badgeText}>
              Only {minutesLeft}m left of {prayerName}
            </AppText>
          </View>

          {/* Spiritual Callout */}
          <View style={styles.spiritualBox}>
            <AppText variant="caption" align="center" style={styles.arabicVerse}>
              وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ
            </AppText>
            <AppText variant="caption" align="center" style={styles.reminderText}>
              Protect your conversation with Allah. Put worldly distractions aside for just a few moments.
            </AppText>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <AppButton
              label={t('stayFocused')}
              onPress={onStayFocused}
              size="md"
              style={styles.stayBtn}
            />

            <Pressable
              onPress={onConfirmExit}
              hitSlop={12}
              style={styles.exitBtn}
              accessibilityRole="button"
              accessibilityLabel="Exit focus mode anyway"
            >
              <AppText variant="caption" style={styles.exitText}>
                Exit Anyway
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    zIndex: 99,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#062B1D',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: -0.2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#A7F3D0',
  },
  spiritualBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 6,
  },
  arabicVerse: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6EE7B7',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  reminderText: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.72)',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    alignItems: 'center',
  },
  stayBtn: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: RADIUS.full,
  },
  exitBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  exitText: {
    fontWeight: '600',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    textDecorationLine: 'underline',
  },
});
