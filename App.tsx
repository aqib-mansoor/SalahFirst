import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { store, hydrateAllStore } from '@/store';
import { WelcomeScreen } from '@/components/welcome';
import { SetupScreen } from '@/components/setup';
import { MainTabShell } from '@/components/home';
import { ScreenTransitionView, AppUpdateBottomSheet } from '@/components/common';
import { AzanPrefsScreen } from '@/components/prayerTimes';
import { PrayerFocusConfigScreen, ActiveFocusScreen } from '@/components/focus';
import { SettingsScreen } from '@/components/settings';
import { PrivacyPolicyScreen, TermsScreen } from '@/components/legal';
import { HadithWallpaperScreen } from '@/components/wallpaper';
import { VERIFIED_HADITHS, HadithItem, getDayOfYearHadithIndex } from '@/data/hadiths';
import { ProgressSubTab } from '@/components/progress';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { FocusDuration, ObligatorySalah } from '@/types';
import { loadFocusDurations, PrayerFocusDurations } from '@/utils/prayerFocusOffsets';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { useDeviceLocation, initDeviceLocationCache } from '@/hooks/useDeviceLocation';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import { useNotificationResponseRouter } from '@/hooks/useNotificationResponseRouter';
import { useAzanAutoReciter } from '@/hooks/useAzanAutoReciter';
import { useFocusAutoSilencer } from '@/hooks/useFocusAutoSilencer';
import { useTheme } from '@/hooks/useTheme';
import { useTransparentNavigationBar } from '@/hooks/useTransparentNavigationBar';
import { useAppBackHandler, AppStep } from '@/hooks/useAppBackHandler';
import { useAppUpdateChecker } from '@/hooks/useAppUpdateChecker';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocalizationProvider, useTranslation } from '@/context/LocalizationContext';
import {
  getActiveFocusSession,
  clearActiveFocusSession,
  createFocusSession,
  saveActiveFocusSession,
  FocusSession,
} from '@/utils/focusSession';
import { registerSingleNotificationPolicy } from '@/utils/notificationCleanup';

export type { AppStep };

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const theme = useTheme();
  const { language } = useTranslation();
  const [isAppReady, setIsAppReady] = useState(false);
  const [currentStep, setCurrentStep] = useState<AppStep>('main');
  const [activeTab, setActiveTab] = useState<HomeTab>('home');
  const [progressSubTab, setProgressSubTab] = useState<ProgressSubTab>('tracker');
  const [focusDuration, setFocusDuration] = useState<FocusDuration>(15);
  const [focusPrayerName, setFocusPrayerName] = useState<string>('Asr');
  const [focusConfigOrigin, setFocusConfigOrigin] = useState<'main' | 'settings'>('main');
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [wallpaperHadith, setWallpaperHadith] = useState<HadithItem | null>(null);

  const { location } = useDeviceLocation();
  const { alerts } = usePrayerAlerts();
  const { prayersList, setPrayerCompleted, prayerData, calcMethod, juristic, fiqh, activeCycle, activeDateKey } =
    usePrayerTracker(location, { enableCountdown: false });

  useNotificationScheduler(location, alerts, calcMethod, juristic, language);
  useFocusAutoSilencer(prayerData.raw, fiqh);

  useAzanAutoReciter({
    location, alerts, calculationMethod: calcMethod, juristicMethod: juristic,
  });

  const { isUpdateVisible, updateInfo, dismissUpdate, openChangelog, currentVersion, currentVersionCode } = useAppUpdateChecker();

  useTransparentNavigationBar({
    isDark: theme.isDark,
    forceLightButtons: currentStep === 'welcome' || currentStep === 'wallpaper',
  });

  useEffect(() => {
    let isMounted = true;
    const initApp = async () => {
      try {
        const [_, cachedLoc, hasCompleted, savedSession] = await Promise.all([
          hydrateAllStore(store.dispatch),
          initDeviceLocationCache(),
          storage.get<boolean>(APP_CONFIG.storageKeys.hasCompletedSetup, false),
          getActiveFocusSession(),
        ]);

        if (!isMounted) return;

        if (!hasCompleted) {
          setCurrentStep('welcome');
          return;
        }

        if (savedSession && savedSession.status === 'active') {
          // Guard: if the session window has already expired, clear it and do NOT show focus
          if (savedSession.targetEndTimestamp <= Date.now()) {
            await clearActiveFocusSession();
          } else {
            setActiveSession(savedSession);
            setFocusPrayerName(savedSession.prayerName);
            setFocusDuration(savedSession.durationMinutes);
            setCurrentStep('focus-active');
            return;
          }
        }

        setCurrentStep('main');
      } finally {
        if (isMounted) {
          setIsAppReady(true);
          await SplashScreen.hideAsync().catch(() => {});
        }
      }
    };
    initApp();
    return () => {
      isMounted = false;
    };
  }, []);

  useNotificationResponseRouter({
    setCurrentStep, setActiveTab, setActiveSession, setFocusPrayerName, setFocusDuration,
    onMarkPrayerCompleted: (name) => setPrayerCompleted(name, true),
  });
  useEffect(() => registerSingleNotificationPolicy(), []);
  useAppBackHandler({ currentStep, setCurrentStep, activeTab, setActiveTab, focusConfigOrigin });

  const handleContinueToSetup = () => setCurrentStep('setup');
  const handleCompleteSetup = async () => {
    await storage.set(APP_CONFIG.storageKeys.hasCompletedSetup, true);
    setCurrentStep('main');
    setActiveTab('home');
  };
  const getSuggestedPrayerInfo = (): { prayerName: string; prayerKey: ObligatorySalah; cycleId?: string; dateKey?: string } => {
    const currentObligatory = prayerData.currentPeriod?.obligatorySalahName as ObligatorySalah | undefined;
    const currentItem = currentObligatory ? prayersList.find((p) => p.name === currentObligatory) : undefined;
    const pendingCurrent = currentItem && !currentItem.completed ? currentObligatory : undefined;
    const resolvedKey = pendingCurrent || (prayerData.nextPrayerName as ObligatorySalah | undefined) || 'Fajr';
    return {
      prayerName: resolvedKey,
      prayerKey: resolvedKey,
      cycleId: activeCycle?.cycleId,
      dateKey: activeDateKey,
    };
  };

  const handleStartFocusImmediately = async () => {
    // Only allow starting focus if there is a currently active, uncompleted prayer
    const currentObligatory = prayerData.currentPeriod?.obligatorySalahName as ObligatorySalah | undefined;
    const currentItem = currentObligatory ? prayersList.find((p) => p.name === currentObligatory) : undefined;
    if (!currentObligatory || !currentItem || currentItem.completed) {
      return;
    }

    const info = getSuggestedPrayerInfo();
    const durations = await loadFocusDurations();
    const key = info.prayerKey.toLowerCase() as keyof PrayerFocusDurations;
    const savedDuration = durations[key] || 15;
    const session = createFocusSession(info.prayerName, savedDuration, 0, info.prayerKey, info.dateKey, info.cycleId);
    await saveActiveFocusSession(session);
    setFocusPrayerName(info.prayerName);
    setFocusDuration(savedDuration);
    setActiveSession(session);
    setCurrentStep('focus-active');
  };

  const handleOpenFocusConfigFromHome = () => {
    setFocusPrayerName(getSuggestedPrayerInfo().prayerName);
    setFocusConfigOrigin('main');
    setCurrentStep('focus-config');
  };
  const handleOpenFocusConfigFromSettings = () => {
    setFocusConfigOrigin('settings');
    setCurrentStep('focus-config');
  };
  const handleOpenWallpaper = (hadith?: HadithItem) => {
    setWallpaperHadith(hadith || VERIFIED_HADITHS[getDayOfYearHadithIndex()]);
    setCurrentStep('wallpaper');
  };

  const handleCompletePrayerFocus = (session: FocusSession) => {
    const targetKey = (session.prayerKey || session.prayerName) as ObligatorySalah;
    setPrayerCompleted(targetKey, true, {
      targetCycleId: session.cycleId,
      targetDateKey: session.dateKey,
      source: 'focus',
    });
  };

  if (!isAppReady) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={currentStep === 'welcome' ? 'light' : theme.isDark ? 'light' : 'dark'} />
      {currentStep === 'welcome' && <WelcomeScreen onContinue={handleContinueToSetup} />}
      {currentStep === 'setup' && <SetupScreen onComplete={handleCompleteSetup} />}

      {/* Persistent Zero-Unmount Tab Shell (Hidden during secondary flows to prevent duplicate navbars) */}
      {currentStep !== 'welcome' && currentStep !== 'setup' && (
        <View style={[styles.mainShell, currentStep !== 'main' && styles.hiddenScreen]}>
          <MainTabShell
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            progressSubTab={progressSubTab}
            setProgressSubTab={setProgressSubTab}
            onOpenSettings={() => setCurrentStep('settings')}
            onOpenAzanPrefs={() => setCurrentStep('azan-prefs')}
            onStartPrayerFocus={handleStartFocusImmediately}
            onOpenFocusSettings={handleOpenFocusConfigFromHome}
            onOpenWallpaper={handleOpenWallpaper}
          />
        </View>
      )}

      {currentStep !== 'main' && currentStep !== 'welcome' && currentStep !== 'setup' && (
        <ScreenTransitionView key={currentStep}>
          {currentStep === 'settings' && (
            <SettingsScreen
              onBack={() => setCurrentStep('main')}
              onOpenAzanPrefs={() => setCurrentStep('azan-prefs')}
              onOpenFocusConfig={handleOpenFocusConfigFromSettings}
              onOpenPrivacyPolicy={() => setCurrentStep('privacy-policy')}
              onOpenTerms={() => setCurrentStep('terms')}
              onOpenChangelog={openChangelog}
            />
          )}
          {currentStep === 'privacy-policy' && <PrivacyPolicyScreen onBack={() => setCurrentStep('settings')} />}
          {currentStep === 'terms' && <TermsScreen onBack={() => setCurrentStep('settings')} />}
          {currentStep === 'azan-prefs' && <AzanPrefsScreen onBack={() => setCurrentStep('settings')} />}
          {currentStep === 'focus-config' && (
            <PrayerFocusConfigScreen
              initialPrayer={focusPrayerName}
              prayerTimesMap={prayerData}
              rawPrayerDates={prayerData.raw}
              onBack={() => setCurrentStep(focusConfigOrigin)}
            />
          )}
          {currentStep === 'focus-active' && (
            <ActiveFocusScreen
              duration={focusDuration}
              prayerName={focusPrayerName}
              existingSession={activeSession}
              onExit={() => { setActiveSession(null); setCurrentStep('main'); }}
              onCompletePrayer={handleCompletePrayerFocus}
            />
          )}
          {currentStep === 'wallpaper' && (
            <HadithWallpaperScreen
              hadith={wallpaperHadith || VERIFIED_HADITHS[getDayOfYearHadithIndex()]}
              onClose={() => setCurrentStep('main')}
            />
          )}
        </ScreenTransitionView>
      )}

      <AppUpdateBottomSheet
        visible={isUpdateVisible}
        updateInfo={updateInfo}
        currentVersion={currentVersion}
        isChangelogOnly={!!updateInfo && updateInfo.latestVersionCode <= currentVersionCode}
        onDismiss={dismissUpdate}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <ThemeProvider>
          <LocalizationProvider><AppContent /></LocalizationProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mainShell: { flex: 1 },
  hiddenScreen: { display: 'none' },
});
