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
    if (remainingSeconds <= 0) {
      setIsCompleted(true);
      return;
    }

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
  }, [remainingSeconds]);

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

  const handleFinishCelebration = () => {
    onCompletePrayer();
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

          <Pressable
            onPress={() => setRemainingSeconds(0)}
            style={styles.simulateBtn}
          >
            <AppText variant="caption" color={PALETTE.goldLight} style={styles.simulateText}>
              Simulate Timer End
            </AppText>
          </Pressable>
        </View>

        {/* Center Timer & Motivation */}
        <View style={styles.centerSection}>
          <ActiveFocusTimer remainingSeconds={remainingSeconds} />

          <View style={styles.motivationColumn}>
            <AppText variant="titleLarge" color={PALETTE.white} align="center" style={styles.motivationTitle}>
              Be present. Focus on your Salah.
            </AppText>
            <AppText variant="bodyMedium" color={theme.colors.textMuted} align="center" style={styles.motivationSub}>
              Notifications from selected distracting apps are paused until your timer completes.
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
            <AppText variant="titleMedium" color={theme.colors.text} align="center" style={styles.congratsTitle}>
              Salah Complete!
            </AppText>
            <AppText variant="bodyMedium" color={theme.colors.textMuted} align="center">
              May Allah accept your prayer and bless your focus.
            </AppText>
            <AppButton
              label="Return to Home"
              onPress={handleFinishCelebration}
              size="md"
              style={[styles.completeBtn, { backgroundColor: theme.colors.primary }]}
            />
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
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
  congratsTitle: {
    fontWeight: '800',
  },
  completeBtn: {
    width: '100%',
    marginTop: SPACING.sm,
  },
});
