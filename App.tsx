import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from '@/components/welcome';
import { SetupScreen } from '@/components/setup';
import { HomeScreen } from '@/components/home';
import { PrayerTimesScreen } from '@/components/prayerTimes';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

export type AppStep = 'welcome' | 'setup' | 'main';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('main');
  const [activeTab, setActiveTab] = useState<HomeTab>('prayers'); // Default to prayers or home

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
    setActiveTab('prayers');
  };

  return (
    <SafeAreaProvider>
      {currentStep === 'welcome' && (
        <WelcomeScreen onContinue={handleContinueToSetup} />
      )}
      {currentStep === 'setup' && (
        <SetupScreen onComplete={handleCompleteSetup} />
      )}
      {currentStep === 'main' && activeTab === 'home' && (
        <HomeScreen
          onOpenSettings={() => setCurrentStep('welcome')}
          onNavigateTab={setActiveTab}
        />
      )}
      {currentStep === 'main' && activeTab === 'prayers' && (
        <PrayerTimesScreen onNavigateHome={() => setActiveTab('home')} />
      )}
    </SafeAreaProvider>
  );
}
