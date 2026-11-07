import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from '@/components/welcome';
import { SetupScreen } from '@/components/setup';
import { HomeScreen } from '@/components/home';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

export type AppStep = 'welcome' | 'setup' | 'home';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('home');

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
    setCurrentStep('home');
  };

  return (
    <SafeAreaProvider>
      {currentStep === 'welcome' && (
        <WelcomeScreen onContinue={handleContinueToSetup} />
      )}
      {currentStep === 'setup' && (
        <SetupScreen onComplete={handleCompleteSetup} />
      )}
      {currentStep === 'home' && (
        <HomeScreen onOpenSettings={() => setCurrentStep('welcome')} />
      )}
    </SafeAreaProvider>
  );
}
