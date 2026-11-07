import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Pressable, Alert, Linking, AppState, AppStateStatus } from 'react-native';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppText } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';
import { ActiveFocusTimer } from './ActiveFocusTimer';
import { FocusCompletionModal } from './FocusCompletionModal';
import { ActiveFocusActions } from './ActiveFocusActions';
import { FocusDuration } from '@/types';
import { useTranslation } from '@/context/LocalizationContext';
import {
  FocusSession,
  createFocusSession,
  saveActiveFocusSession,
  clearActiveFocusSession,
  calculateRemainingSeconds,
} from '@/utils/focusSession';

export interface ActiveFocusScreenProps {
  duration?: FocusDuration;
  prayerName?: string;
  existingSession?: FocusSession | null;
  onExit: () => void;
  onCompletePrayer: () => void;
}

export const ActiveFocusScreen: React.FC<ActiveFocusScreenProps> = ({
  duration = 15,
  prayerName = 'Asr',
  existingSession = null,
  onExit,
  onCompletePrayer,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const sessionRef = useRef<FocusSession>(
    existingSession || createFocusSession(prayerName, duration)
  );

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    calculateRemainingSeconds(sessionRef.current)
  );
  const [isCompleted, setIsCompleted] = useState(
    () => calculateRemainingSeconds(sessionRef.current) <= 0
  );

  // Persist session to AsyncStorage on mount
  useEffect(() => {
    saveActiveFocusSession(sessionRef.current);
  }, []);

  const tick = useCallback(() => {
    const left = calculateRemainingSeconds(sessionRef.current);
    setRemainingSeconds(left);
    if (left <= 0) {
      setIsCompleted(true);
    }
  }, []);

  // Interval timer for real-time countdown
  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, tick]);

  // Handle app coming to foreground from background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        tick();
      }
    });

    return () => subscription.remove();
  }, [tick]);

  const handleExitEarly = () => {
    Alert.alert(
      t('exitFocusEarlyPrompt'),
      t('exitFocusConfirm'),
      [
        { text: t('stayFocused'), style: 'cancel' },
        {
          text: t('exit'),
          style: 'destructive',
          onPress: async () => {
            await clearActiveFocusSession();
            onExit();
          },
        },
      ]
    );
  };

  const handleEmergencyCall = async () => {
    try {
      const canOpen = await Linking.canOpenURL('tel:');
      if (canOpen) {
        await Linking.openURL('tel:');
      } else {
        Alert.alert(t('emergencyCall'), 'Phone dialer is not available on this device.');
      }
    } catch {
      Alert.alert(t('emergencyCall'), 'Unable to open phone dialer.');
    }
  };

  const handleConfirmPrayed = async () => {
    await clearActiveFocusSession();
    onCompletePrayer();
    onExit();
  };

  const handleNotYet = async () => {
    await clearActiveFocusSession();
    onExit();
  };

  const effectivePrayer = sessionRef.current.prayerName;
  const effectiveDuration = sessionRef.current.durationMinutes;

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
            {effectivePrayer} Focus • {effectiveDuration}m
          </AppText>

          {__DEV__ && (
            <Pressable
              onPress={() => {
                sessionRef.current.targetEndTimestamp = Date.now();
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
              {t('bePresent')}
            </AppText>
            <AppText variant="bodyMedium" color={theme.colors.accentLight} align="center" style={styles.motivationSub}>
              {t('setDistractionsAside')}
            </AppText>
          </View>
        </View>

        {/* Bottom Actions */}
        <ActiveFocusActions
          onEmergencyCall={handleEmergencyCall}
          onExitEarly={handleExitEarly}
        />
      </View>

      <FocusCompletionModal
        visible={isCompleted}
        prayerName={effectivePrayer}
        onConfirmPrayed={handleConfirmPrayed}
        onNotYet={handleNotYet}
      />
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
});
