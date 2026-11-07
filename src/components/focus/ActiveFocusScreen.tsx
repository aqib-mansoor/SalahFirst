import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Alert, Linking } from 'react-native';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppText, AppButton } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';
import { ActiveFocusTimer } from './ActiveFocusTimer';
import { FocusDuration } from '@/types';

export interface ActiveFocusScreenProps {
  duration?: FocusDuration;
  prayerName?: string;
  onExit: () => void;
  onCompletePrayer: () => void;
}

export const ActiveFocusScreen: React.FC<ActiveFocusScreenProps> = ({
  duration = 15,
  prayerName = 'Asr / Maghrib',
  onExit,
  onCompletePrayer,
}) => {
  const theme = useTheme('dark');
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleExitEarly = () => {
    Alert.alert(
      'Exit Focus Early?',
      'Are you sure you want to end your Salah Focus session before the timer finishes?',
      [
        { text: 'Stay Focused', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: onExit },
      ]
    );
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:112').catch(() => {
      Alert.alert('Emergency Call', 'Opening emergency dialer.');
    });
  };

  const handleConfirmPrayed = () => {
    onCompletePrayer();
    onExit();
  };

  const handleNotYet = () => {
    onExit();
  };

  return (
    <AppContainer
      edges={['top', 'left', 'right', 'bottom']}
      style={{ backgroundColor: theme.colors.bannerGreen }}
    >
      <IslamicWatermark size={320} opacity={0.16} style={styles.watermarkTop} />
      <IslamicWatermark size={340} opacity={0.16} style={styles.watermarkBottom} />

      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <AppText variant="titleSmall" color={PALETTE.goldLight} style={styles.headerTitle}>
            {prayerName} Focus • {duration}m
          </AppText>

          {__DEV__ && (
            <Pressable
              onPress={() => {
                setRemainingSeconds(0);
                setIsCompleted(true);
              }}
              style={styles.simulateBtn}
            >
              <AppText variant="caption" color={PALETTE.goldLight} style={styles.simulateText}>
                DEV: End Timer
              </AppText>
            </Pressable>
          )}
        </View>

        {/* Center Timer & Motivation */}
        <View style={styles.centerSection}>
          <ActiveFocusTimer remainingSeconds={remainingSeconds} />

          <View style={styles.motivationColumn}>
            <AppText variant="titleLarge" color={PALETTE.white} align="center" style={styles.motivationTitle}>
              Be present. Focus on your Salah.
            </AppText>
            <AppText variant="bodyMedium" color={theme.colors.textMuted} align="center" style={styles.motivationSub}>
              Set all distractions aside and dedicate this time purely to prayer.
            </AppText>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomRow}>
          <Pressable onPress={handleEmergencyCall} style={styles.emergencyBtn}>
            <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.emergencyText}>
              Emergency Call Access
            </AppText>
          </Pressable>

          <Pressable onPress={handleExitEarly} hitSlop={10}>
            <AppText variant="bodySmall" color={PALETTE.white} style={styles.exitText}>
              Exit Focus Early
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* Completion Modal Overlay */}
      {isCompleted && (
        <View style={styles.completionOverlay}>
          <View style={[styles.completionCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.badgePill, { backgroundColor: theme.colors.mintTint }]}>
              <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
                FOCUS SESSION FINISHED
              </AppText>
            </View>

            <AppText variant="titleMedium" color={theme.colors.text} align="center" style={styles.congratsTitle}>
              Did you complete your prayer?
            </AppText>

            <AppText variant="bodySmall" color={theme.colors.textMuted} align="center" style={styles.congratsSub}>
              {prayerName} • May Allah accept your worship and bless your focus.
            </AppText>

            <View style={styles.modalActions}>
              <AppButton
                label="Yes, I prayed"
                onPress={handleConfirmPrayed}
                size="md"
                style={[styles.completeBtn, { backgroundColor: theme.colors.primary }]}
              />

              <Pressable onPress={handleNotYet} hitSlop={12} style={styles.notYetBtn}>
                <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.notYetText}>
                  Not yet
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  watermarkTop: {
    top: 20,
    left: -70,
  },
  watermarkBottom: {
    bottom: -30,
    right: -80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  headerTitle: {
    fontWeight: '700',
  },
  simulateBtn: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: PALETTE.gold,
  },
  simulateText: {
    fontWeight: '700',
    fontSize: 11,
  },
  centerSection: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  motivationColumn: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  motivationTitle: {
    fontWeight: '800',
  },
  motivationSub: {
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  emergencyBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  emergencyText: {
    fontWeight: '600',
  },
  exitText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  completionOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  completionCard: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: RADIUS.xxl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  badgePill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  congratsTitle: {
    fontWeight: '800',
    fontSize: 20,
  },
  congratsSub: {
    lineHeight: 18,
  },
  modalActions: {
    width: '100%',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    alignItems: 'center',
  },
  completeBtn: {
    width: '100%',
  },
  notYetBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  notYetText: {
    fontWeight: '600',
  },
});
