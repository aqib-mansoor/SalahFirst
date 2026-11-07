import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from '@/components/welcome';
import { SetupScreen } from '@/components/setup';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

export default function App() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'setup'>('welcome');

  const handleContinueToSetup = () => {
    setCurrentStep('setup');
  };

  const handleCompleteSetup = async () => {
    await storage.set(APP_CONFIG.storageKeys.hasCompletedSetup, true);
    // Ready for Home/Dashboard screen next
  };

  return (
    <SafeAreaProvider>
      {currentStep === 'welcome' ? (
        <WelcomeScreen onContinue={handleContinueToSetup} />
      ) : (
        <SetupScreen onComplete={handleCompleteSetup} />
      )}
    </SafeAreaProvider>
  );
}
