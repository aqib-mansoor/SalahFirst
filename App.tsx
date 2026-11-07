import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from '@/components/welcome';

export default function App() {
  const handleContinue = () => {
    // Screen-by-screen progression: Ready for Setup Screen
  };

  return (
    <SafeAreaProvider>
      <WelcomeScreen onContinue={handleContinue} />
    </SafeAreaProvider>
  );
}
