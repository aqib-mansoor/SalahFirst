import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Alert, Linking, AppState, AppStateStatus } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { SPACING, PALETTE } from '@/constants/theme';
import { AppContainer, AppText, PermissionGuideBottomSheet } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';
import { ActiveFocusHeader } from './ActiveFocusHeader';
import { ActiveFocusTimer } from './ActiveFocusTimer';
import { FocusCompletionModal } from './FocusCompletionModal';
import { FocusExitEarlyModal } from './FocusExitEarlyModal';
import { ActiveFocusActions } from './ActiveFocusActions';
import { FocusDuration } from '@/types';
import { useTranslation } from '@/context/LocalizationContext';
import {
  FocusSession,
  createFocusSession,
  saveActiveFocusSession,
  clearActiveFocusSession,
  calculateRemainingSeconds,
  markFocusCompleted,
} from '@/utils/focusSession';
import {
  startFocusNotifications,
  cancelFocusNotifications,
  triggerFocusBreachNotification,
  dismissFocusBreachNotification,
} from '@/utils/focusNotification';
import { loadFocusPreferences } from '@/utils/prayerFocusOffsets';
import {
  startFocusBlocker,
  stopFocusBlocker,
  DISTRACTING_APPS_CATALOG,
  fetchPermissionsStatus,
} from '@/native/FocusBlockerBridge';

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
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const sessionRef = useRef<FocusSession>(
    existingSession || createFocusSession(prayerName, duration)
  );
  const blockedSummaryRef = useRef<string>('');

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    calculateRemainingSeconds(sessionRef.current)
  );
  const [isCompleted, setIsCompleted] = useState(
    () => calculateRemainingSeconds(sessionRef.current) <= 0
  );
  const [showExitModal, setShowExitModal] = useState(false);
  const [showAccessSheet, setShowAccessSheet] = useState(false);
  const [breachCount, setBreachCount] = useState<number>(sessionRef.current.breachCount || 0);

  useEffect(() => {
    saveActiveFocusSession(sessionRef.current);
    startFocusNotifications(sessionRef.current.prayerName, sessionRef.current.durationMinutes);
    loadFocusPreferences().then((prefs) => {
      const pkgs = prefs.blockedAppPackages && prefs.blockedAppPackages.length > 0
        ? prefs.blockedAppPackages
        : DISTRACTING_APPS_CATALOG.filter((a) => a.defaultSelected).map((a) => a.package);
      startFocusBlocker(pkgs);

      fetchPermissionsStatus().then((s) => {
        if (!s.accessibility) setShowAccessSheet(true);
      });
    });

    return () => {
      stopFocusBlocker();
    };
  }, []);

  const tick = useCallback(() => {
    const left = calculateRemainingSeconds(sessionRef.current);
    setRemainingSeconds(left);
    if (left <= 0) {
      setIsCompleted(true);
      // Persist completion immediately so app-reopen doesn't re-show focus
      markFocusCompleted(sessionRef.current.prayerName);
    }
  }, []);

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, tick]);

  // Aggressive Heads-Up Interceptor: repeatedly drops alerts while user is on other apps
  useEffect(() => {
    let breachInterval: ReturnType<typeof setInterval> | null = null;

    const fireBreach = () => {
      triggerFocusBreachNotification(
        sessionRef.current.prayerName,
        blockedSummaryRef.current || undefined
      );
    };

    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (!isCompleted) {
          fireBreach();
          setBreachCount((prev) => {
            const next = prev + 1;
            sessionRef.current.breachCount = next;
            saveActiveFocusSession(sessionRef.current);
            return next;
          });

          if (breachInterval) clearInterval(breachInterval);
          breachInterval = setInterval(fireBreach, 12000);
        }
      } else if (nextState === 'active') {
        if (breachInterval) {
          clearInterval(breachInterval);
          breachInterval = null;
        }
        dismissFocusBreachNotification();
        tick();
      }
    });

    return () => {
      if (breachInterval) clearInterval(breachInterval);
      sub.remove();
    };
  }, [isCompleted, tick]);

  const handleCleanExit = async (afterAction?: () => void) => {
    await stopFocusBlocker();
    await dismissFocusBreachNotification();
    await clearActiveFocusSession();
    await cancelFocusNotifications();
    await markFocusCompleted(sessionRef.current.prayerName);
    afterAction?.();
    onExit();
  };

  const handleEmergencyCall = async () => {
    try {
      const canOpen = await Linking.canOpenURL('tel:');
      if (canOpen) await Linking.openURL('tel:');
      else Alert.alert(t('emergencyCall'), 'Phone dialer is not available on this device.');
    } catch {
      Alert.alert(t('emergencyCall'), 'Unable to open phone dialer.');
    }
  };

  const effectivePrayer = sessionRef.current.prayerName;
  const effectiveDuration = sessionRef.current.durationMinutes;

  return (
    <AppContainer edges={[]} style={styles.screenBg}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="sanctuaryGlow" cx="50%" cy="40%" r="65%">
            <Stop offset="0%" stopColor="#145A41" stopOpacity="0.8" />
            <Stop offset="65%" stopColor="#0B3E2D" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#041E14" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#sanctuaryGlow)" />
      </Svg>

      <IslamicWatermark size={280} opacity={0.025} color="rgba(255, 255, 255, 0.04)" style={styles.watermarkTop} />
      <IslamicWatermark size={280} opacity={0.025} color="rgba(255, 255, 255, 0.04)" style={styles.watermarkBottom} />

      <View style={[styles.container, { paddingTop: Math.max(insets.top, 24) + 16 }]}>
        <ActiveFocusHeader
          prayerName={effectivePrayer}
          durationMinutes={effectiveDuration}
          onSimulateEnd={() => {
            sessionRef.current.targetEndTimestamp = Date.now();
            setRemainingSeconds(0);
            setIsCompleted(true);
          }}
        />

        <View style={styles.centerSection}>
          <ActiveFocusTimer remainingSeconds={remainingSeconds} totalSeconds={effectiveDuration * 60} />
          <View style={styles.spiritualColumn}>
            <AppText variant="bodySmall" style={styles.quranicArabic}>وَأَقِمِ ٱلصَّلَوٰةَ لِذِكْرِى</AppText>
            <AppText variant="titleMedium" color={PALETTE.white} align="center" style={styles.motivationTitle}>
              {t('bePresent')}
            </AppText>
            <AppText variant="bodySmall" align="center" style={styles.motivationSub}>
              {t('setDistractionsAside')}
            </AppText>
          </View>
        </View>

        <ActiveFocusActions onEmergencyCall={handleEmergencyCall} onExitEarly={() => setShowExitModal(true)} />
      </View>

      <FocusCompletionModal
        visible={isCompleted}
        prayerName={effectivePrayer}
        breachCount={breachCount}
        onConfirmPrayed={() => handleCleanExit(onCompletePrayer)}
        onNotYet={() => handleCleanExit()}
      />

      <FocusExitEarlyModal
        visible={showExitModal}
        prayerName={effectivePrayer}
        remainingSeconds={remainingSeconds}
        onStayFocused={() => setShowExitModal(false)}
        onConfirmExit={() => { setShowExitModal(false); handleCleanExit(); }}
      />
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  screenBg: { backgroundColor: '#041E14' },
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: SPACING.lg },
  watermarkTop: { top: -80, left: -110 },
  watermarkBottom: { bottom: -90, right: -110 },
  centerSection: { alignItems: 'center', gap: SPACING.md },
  spiritualColumn: { alignItems: 'center', gap: 6, paddingHorizontal: SPACING.lg },
  quranicArabic: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(110, 231, 183, 0.9)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 2,
  },
  motivationTitle: { fontWeight: '800', letterSpacing: -0.2 },
  motivationSub: { lineHeight: 20, color: 'rgba(255, 255, 255, 0.68)' },
});
