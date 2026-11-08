import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Pressable, Alert, Linking, AppState, AppStateStatus } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { startFocusNotifications, cancelFocusNotifications } from '@/utils/focusNotification';

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
  const insets = useSafeAreaInsets();
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

  // Persist session to AsyncStorage and trigger background notifications on mount
  useEffect(() => {
    saveActiveFocusSession(sessionRef.current);
    startFocusNotifications(sessionRef.current.prayerName, sessionRef.current.durationMinutes);
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
            await cancelFocusNotifications();
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
    await cancelFocusNotifications();
    onCompletePrayer();
    onExit();
  };

  const handleNotYet = async () => {
    await clearActiveFocusSession();
    await cancelFocusNotifications();
    onExit();
  };

  const effectivePrayer = sessionRef.current.prayerName;
  const effectiveDuration = sessionRef.current.durationMinutes;

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.primaryHero }}
    >
      <IslamicWatermark size={260} opacity={0.03} color="rgba(255, 255, 255, 0.05)" style={styles.watermarkTop} />
      <IslamicWatermark size={260} opacity={0.03} color="rgba(255, 255, 255, 0.05)" style={styles.watermarkBottom} />

      <View style={[styles.container, { paddingTop: Math.max(insets.top, SPACING.xs) }]}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <View style={styles.headerDot} />
            <AppText variant="caption" color={PALETTE.white} style={styles.headerTitle}>
              {effectivePrayer} Focus • {effectiveDuration}m
            </AppText>
          </View>

          {__DEV__ && (
            <Pressable
              onPress={() => {
                sessionRef.current.targetEndTimestamp = Date.now();
                setRemainingSeconds(0);
                setIsCompleted(true);
              }}
              style={styles.simulateBtn}
            >
              <AppText variant="caption" style={styles.simulateText}>
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
            <AppText variant="bodyMedium" align="center" style={styles.motivationSub}>
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
  },
  watermarkTop: {
    top: -50,
    left: -90,
  },
  watermarkBottom: {
    bottom: -60,
    right: -90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  simulateBtn: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  simulateText: {
    fontWeight: '600',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
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
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
