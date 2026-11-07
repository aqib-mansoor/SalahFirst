import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { WelcomeScreen } from '@/components/welcome';
import { SetupScreen } from '@/components/setup';
import { HomeScreen } from '@/components/home';
import { PrayerTimesScreen, AzanPrefsScreen } from '@/components/prayerTimes';
import { PrayerFocusConfigScreen, ActiveFocusScreen } from '@/components/focus';
import { SettingsScreen } from '@/components/settings';
import { QiblaScreen } from '@/components/qibla';
import { HadithScreen } from '@/components/hadith';
import { HadithWallpaperScreen } from '@/components/wallpaper';
import { VERIFIED_HADITHS, getDayOfYearHadithIndex } from '@/data/hadiths';
import { ProgressScreen, ProgressSubTab } from '@/components/progress';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { FocusDuration } from '@/types';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import { useTheme } from '@/hooks/useTheme';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocalizationProvider, useTranslation } from '@/context/LocalizationContext';
import { getActiveFocusSession, FocusSession } from '@/utils/focusSession';

export type AppStep =
  | 'welcome'
  | 'setup'
  | 'main'
  | 'settings'
  | 'azan-prefs'
  | 'focus-config'
  | 'focus-active'
  | 'wallpaper';

function AppContent() {
  const theme = useTheme();
  const { language } = useTranslation();
  const [currentStep, setCurrentStep] = useState<AppStep>('main');
  const [activeTab, setActiveTab] = useState<HomeTab>('home');
  const [progressSubTab, setProgressSubTab] = useState<ProgressSubTab>('tracker');
  const [focusDuration, setFocusDuration] = useState<FocusDuration>(15);
  const [focusPrayerName, setFocusPrayerName] = useState<string>('Asr');
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);

  const { location } = useDeviceLocation();
  const { alerts } = usePrayerAlerts();
  const {
    prayersList,
    setPrayerCompleted,
    prayerData,
    calcMethod,
    juristic,
  } = usePrayerTracker(location);

  useNotificationScheduler(location, alerts, calcMethod, juristic, language);

  // Check setup status and restore any active focus session on startup
  useEffect(() => {
    const initApp = async () => {
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
      }
    };
    initApp();
  }, []);

  // Listen for user tapping a scheduled prayer alert notification
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data && data.prayerName) {
        setFocusPrayerName(String(data.prayerName));
        setCurrentStep('focus-config');
      }
    });

    return () => subscription.remove();
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep === 'wallpaper') {
        setCurrentStep('main');
        return true;
      }
      if (currentStep === 'focus-config') {
        setCurrentStep('main');
        return true;
      }
      if (currentStep === 'azan-prefs') {
        setCurrentStep('settings');
        return true;
      }
      if (currentStep === 'settings') {
        setCurrentStep('main');
        return true;
      }
      if (currentStep === 'main' && activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [currentStep, activeTab]);

  const handleContinueToSetup = () => {
    setCurrentStep('setup');
  };

  const handleCompleteSetup = async () => {
    await storage.set(APP_CONFIG.storageKeys.hasCompletedSetup, true);
    setCurrentStep('main');
    setActiveTab('home');
  };

  const handleOpenFocusConfig = () => {
    const currentPending = prayersList.find(
      (p) => p.name.toUpperCase() === prayerData.currentPrayerName && !p.completed
    );
    const suggested = currentPending ? currentPending.name : (prayerData.nextPrayerName || 'Asr');
    setFocusPrayerName(suggested);
    setCurrentStep('focus-config');
  };

  const handleBeginFocus = (duration: FocusDuration, prayerName: string) => {
    setFocusDuration(duration);
    setFocusPrayerName(prayerName);
    setActiveSession(null);
    setCurrentStep('focus-active');
  };

  const handleCompletePrayerFocus = () => {
    setPrayerCompleted(focusPrayerName, true);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
      {currentStep === 'welcome' && (
        <WelcomeScreen onContinue={handleContinueToSetup} />
      )}
        {currentStep === 'setup' && (
          <SetupScreen onComplete={handleCompleteSetup} />
        )}
        {currentStep === 'main' && activeTab === 'home' && (
          <HomeScreen
            onOpenSettings={() => setCurrentStep('settings')}
            onNavigateTab={setActiveTab}
            onStartPrayerFocus={handleOpenFocusConfig}
            onOpenStreaks={() => {
              setProgressSubTab('streaks');
              setActiveTab('progress');
            }}
            onOpenWallpaper={() => setCurrentStep('wallpaper')}
          />
        )}
        {currentStep === 'main' && activeTab === 'prayers' && (
          <PrayerTimesScreen
            onNavigateHome={() => setActiveTab('home')}
            onNavigateTab={setActiveTab}
          />
        )}
        {currentStep === 'main' && activeTab === 'qibla' && (
          <QiblaScreen onNavigateTab={setActiveTab} />
        )}
        {currentStep === 'main' && activeTab === 'hadith' && (
          <HadithScreen onNavigateTab={setActiveTab} />
        )}
        {currentStep === 'main' && activeTab === 'progress' && (
          <ProgressScreen
            initialSubTab={progressSubTab}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'progress') setProgressSubTab('tracker');
            }}
          />
        )}
        {currentStep === 'settings' && (
          <SettingsScreen
            onBack={() => setCurrentStep('main')}
            onOpenAzanPrefs={() => setCurrentStep('azan-prefs')}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setCurrentStep('main');
            }}
          />
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
            onBack={() => setCurrentStep('main')}
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
      </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AppContent />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
