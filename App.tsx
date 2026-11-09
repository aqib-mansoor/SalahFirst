import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Provider } from 'react-redux';
import { store, hydrateAllStore } from '@/store';
import { WelcomeScreen } from '@/components/welcome';
import { SetupScreen } from '@/components/setup';
import { MainTabShell } from '@/components/home';
import { AzanPrefsScreen, FloatingAzanBanner } from '@/components/prayerTimes';
import { PrayerFocusConfigScreen, ActiveFocusScreen } from '@/components/focus';
import { SettingsScreen } from '@/components/settings';
import { PrivacyPolicyScreen, TermsScreen } from '@/components/legal';
import { HadithWallpaperScreen } from '@/components/wallpaper';
import { VERIFIED_HADITHS, getDayOfYearHadithIndex } from '@/data/hadiths';
import { ProgressSubTab } from '@/components/progress';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { FocusDuration } from '@/types';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import { useAzanAutoReciter } from '@/hooks/useAzanAutoReciter';
import { useTheme } from '@/hooks/useTheme';
import { useTransparentNavigationBar } from '@/hooks/useTransparentNavigationBar';
import { useAppBackHandler, AppStep } from '@/hooks/useAppBackHandler';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocalizationProvider, useTranslation } from '@/context/LocalizationContext';
import { getActiveFocusSession, FocusSession, createFocusSession, saveActiveFocusSession } from '@/utils/focusSession';
import { checkAndActivateCurrentAutoFocus } from '@/utils/prayerFocusOffsets';
import { registerSingleNotificationPolicy } from '@/utils/notificationCleanup';

export type { AppStep };

function AppContent() {
  const theme = useTheme();
  const { language } = useTranslation();
  const [currentStep, setCurrentStep] = useState<AppStep>('main');
  const [activeTab, setActiveTab] = useState<HomeTab>('home');
  const [progressSubTab, setProgressSubTab] = useState<ProgressSubTab>('tracker');
  const [focusDuration, setFocusDuration] = useState<FocusDuration>(15);
  const [focusPrayerName, setFocusPrayerName] = useState<string>('Asr');
  const [focusConfigOrigin, setFocusConfigOrigin] = useState<'main' | 'settings'>('main');
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);

  const { location } = useDeviceLocation();
  const { alerts } = usePrayerAlerts();
  const {
    prayersList,
    setPrayerCompleted,
    prayerData,
    calcMethod,
    juristic,
  } = usePrayerTracker(location, { enableCountdown: false });

  useNotificationScheduler(location, alerts, calcMethod, juristic, language);

  const { isReciting, recitingPrayer, stopRecitation } = useAzanAutoReciter({
    location,
    alerts,
    calculationMethod: calcMethod,
    juristicMethod: juristic,
  });

  useTransparentNavigationBar({
    isDark: theme.isDark,
    forceLightButtons: currentStep === 'welcome' || currentStep === 'wallpaper',
  });

  // Check setup status and restore any active focus session on startup
  useEffect(() => {
    const initApp = async () => {
      await hydrateAllStore(store.dispatch);

      const hasCompleted = await storage.get<boolean>(
        APP_CONFIG.storageKeys.hasCompletedSetup,
        false
      );
      if (!hasCompleted) {
        setCurrentStep('welcome');
        return;
      }

      const savedSession = await getActiveFocusSession();
      if (savedSession && savedSession.status === 'active') {
        setActiveSession(savedSession);
        setFocusPrayerName(savedSession.prayerName);
        setFocusDuration(savedSession.durationMinutes);
        setCurrentStep('focus-active');
        return;
      }

      if (location?.latitude != null) {
        const autoSession = await checkAndActivateCurrentAutoFocus(prayerData.raw);
        if (autoSession) {
          setActiveSession(autoSession);
          setFocusPrayerName(autoSession.prayerName);
          setFocusDuration(autoSession.durationMinutes);
          setCurrentStep('focus-active');
        }
      }
    };
    initApp();
  }, [location?.latitude, prayerData.raw]);

  // Listen for user tapping a scheduled prayer alert or inspiration notification
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        type?: string;
        prayerName?: string;
        duration?: FocusDuration;
        targetEndTimestamp?: number;
      } | null;

      if (data && data.type === 'auto-focus-start' && data.prayerName) {
        const prayer = String(data.prayerName);
        const duration = (Number(data.duration) || 15) as FocusDuration;
        const session = createFocusSession(prayer, duration);
        if (data.targetEndTimestamp) {
          session.targetEndTimestamp = Number(data.targetEndTimestamp);
        }
        saveActiveFocusSession(session);
        setActiveSession(session);
        setFocusPrayerName(prayer);
        setFocusDuration(duration);
        setCurrentStep('focus-active');
      } else if (data && data.prayerName) {
        setFocusPrayerName(String(data.prayerName));
        setCurrentStep('focus-config');
      } else if (data && data.type === 'daily-inspiration') {
        setCurrentStep('main');
        setActiveTab('hadith');
      } else if (data && data.type === 'reengagement') {
        setCurrentStep('main');
        setActiveTab('home');
      }
    });

    return () => subscription.remove();
  }, []);

  // Enforce single active alert in notification shade
  useEffect(() => registerSingleNotificationPolicy(), []);

  // Handle Android hardware back button
  useAppBackHandler({
    currentStep,
    setCurrentStep,
    activeTab,
    setActiveTab,
    focusConfigOrigin,
  });

  const handleContinueToSetup = () => setCurrentStep('setup');
  const handleCompleteSetup = async () => {
    await storage.set(APP_CONFIG.storageKeys.hasCompletedSetup, true);
    setCurrentStep('main');
    setActiveTab('home');
  };
  const getSuggestedPrayerName = () => {
    const pending = prayersList.find((p) => p.name.toUpperCase() === prayerData.currentPrayerName && !p.completed);
    return pending ? pending.name : (prayerData.nextPrayerName || 'Fajr');
  };
  const handleStartFocusImmediately = () => {
    setFocusPrayerName(getSuggestedPrayerName());
    setActiveSession(null);
    setCurrentStep('focus-active');
  };
  const handleOpenFocusConfigFromHome = () => {
    setFocusPrayerName(getSuggestedPrayerName());
    setFocusConfigOrigin('main');
    setCurrentStep('focus-config');
  };
  const handleOpenFocusConfigFromSettings = () => {
    setFocusConfigOrigin('settings');
    setCurrentStep('focus-config');
  };
  const handleBeginFocus = (duration: FocusDuration, prayerName: string) => {
    setFocusDuration(duration);
    setFocusPrayerName(prayerName);
    setActiveSession(null);
    setCurrentStep('focus-active');
  };

  const handleCompletePrayerFocus = () => setPrayerCompleted(focusPrayerName, true);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={currentStep === 'welcome' ? 'light' : theme.isDark ? 'light' : 'dark'} />
      {currentStep === 'welcome' && (
        <WelcomeScreen onContinue={handleContinueToSetup} />
      )}
      {currentStep === 'setup' && (
        <SetupScreen onComplete={handleCompleteSetup} />
      )}

      {/* Persistent Zero-Unmount Tab Shell */}
      {currentStep === 'main' && (
        <MainTabShell
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          progressSubTab={progressSubTab}
          setProgressSubTab={setProgressSubTab}
          onOpenSettings={() => setCurrentStep('settings')}
          onStartPrayerFocus={handleStartFocusImmediately}
          onOpenFocusSettings={handleOpenFocusConfigFromHome}
          onOpenWallpaper={() => setCurrentStep('wallpaper')}
        />
      )}

      {currentStep === 'settings' && (
        <SettingsScreen
          onBack={() => setCurrentStep('main')}
          onOpenAzanPrefs={() => setCurrentStep('azan-prefs')}
          onOpenFocusConfig={handleOpenFocusConfigFromSettings}
          onOpenPrivacyPolicy={() => setCurrentStep('privacy-policy')}
          onOpenTerms={() => setCurrentStep('terms')}
        />
      )}
      {currentStep === 'privacy-policy' && (
        <PrivacyPolicyScreen onBack={() => setCurrentStep('settings')} />
      )}
      {currentStep === 'terms' && (
        <TermsScreen onBack={() => setCurrentStep('settings')} />
      )}
      {currentStep === 'azan-prefs' && (
        <AzanPrefsScreen onBack={() => setCurrentStep('settings')} />
      )}
      {currentStep === 'focus-config' && (
        <PrayerFocusConfigScreen
          initialPrayer={focusPrayerName}
          prayerTimesMap={{
            fajr: prayerData.fajr,
            dhuhr: prayerData.dhuhr,
            asr: prayerData.asr,
            maghrib: prayerData.maghrib,
            isha: prayerData.isha,
          }}
          rawPrayerDates={prayerData.raw}
          onBack={() => setCurrentStep(focusConfigOrigin)}
          onBeginFocus={handleBeginFocus}
        />
      )}
      {currentStep === 'focus-active' && (
        <ActiveFocusScreen
          duration={focusDuration}
          prayerName={focusPrayerName}
          existingSession={activeSession}
          onExit={() => {
            setActiveSession(null);
            setCurrentStep('main');
          }}
          onCompletePrayer={handleCompletePrayerFocus}
        />
      )}
      {currentStep === 'wallpaper' && (
        <HadithWallpaperScreen
          hadith={VERIFIED_HADITHS[getDayOfYearHadithIndex()]}
          onClose={() => setCurrentStep('main')}
        />
      )}
      <FloatingAzanBanner
        visible={isReciting}
        prayerName={recitingPrayer}
        onStop={stopRecitation}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <ThemeProvider>
          <LocalizationProvider>
            <AppContent />
          </LocalizationProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
