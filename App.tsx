import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from '@/components/welcome';
import { SetupScreen } from '@/components/setup';
import { HomeScreen } from '@/components/home';
import { PrayerTimesScreen, AzanPrefsScreen } from '@/components/prayerTimes';
import { PrayerFocusConfigScreen, ActiveFocusScreen } from '@/components/focus';
import { SettingsScreen } from '@/components/settings';
import { QiblaScreen } from '@/components/qibla';
import { HadithScreen } from '@/components/hadith';
import { ProgressScreen, ProgressSubTab } from '@/components/progress';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { FocusDuration } from '@/types';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import { ThemeProvider } from '@/context/ThemeContext';

export type AppStep =
  | 'welcome'
  | 'setup'
  | 'main'
  | 'settings'
  | 'azan-prefs'
  | 'focus-config'
  | 'focus-active';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('main');
  const [activeTab, setActiveTab] = useState<HomeTab>('home');
  const [progressSubTab, setProgressSubTab] = useState<ProgressSubTab>('tracker');
  const [focusDuration, setFocusDuration] = useState<FocusDuration>(15);

  const { location } = useDeviceLocation();
  const { alerts } = usePrayerAlerts();
  const { togglePrayer, setPrayerCompleted, prayerData, calcMethod, juristic } = usePrayerTracker(location);
  useNotificationScheduler(location, alerts, calcMethod, juristic);

  useEffect(() => {
    const checkSetupStatus = async () => {
      const hasCompleted = await storage.get<boolean>(
        APP_CONFIG.storageKeys.hasCompletedSetup,
        false
      );
      if (!hasCompleted) {
        setCurrentStep('welcome');
      }
    };
    checkSetupStatus();
  }, []);

  const handleContinueToSetup = () => {
    setCurrentStep('setup');
  };

  const handleCompleteSetup = async () => {
    await storage.set(APP_CONFIG.storageKeys.hasCompletedSetup, true);
    setCurrentStep('main');
    setActiveTab('home');
  };

  const handleBeginFocus = (duration: FocusDuration) => {
    setFocusDuration(duration);
    setCurrentStep('focus-active');
  };

  const handleCompletePrayerFocus = () => {
    const currentName = prayerData.nextPrayerName || 'Asr';
    setPrayerCompleted(currentName, true);
  };

  return (
    <ThemeProvider>
      <SafeAreaProvider>
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
            onStartPrayerFocus={() => setCurrentStep('focus-config')}
            onOpenStreaks={() => {
              setProgressSubTab('streaks');
              setActiveTab('progress');
            }}
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
            onBack={() => setCurrentStep('main')}
            onBeginFocus={handleBeginFocus}
          />
        )}
        {currentStep === 'focus-active' && (
          <ActiveFocusScreen
            duration={focusDuration}
            prayerName={prayerData.nextPrayerName || 'Asr'}
            onExit={() => setCurrentStep('main')}
            onCompletePrayer={handleCompletePrayerFocus}
          />
        )}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
