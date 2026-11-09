import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { HomeTab } from '@/components/home/HomeBottomNav';

export type AppStep =
  | 'welcome'
  | 'setup'
  | 'main'
  | 'settings'
  | 'azan-prefs'
  | 'focus-config'
  | 'focus-active'
  | 'wallpaper'
  | 'privacy-policy'
  | 'terms';

export interface UseAppBackHandlerProps {
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  activeTab: HomeTab;
  setActiveTab: (tab: HomeTab) => void;
  focusConfigOrigin: 'main' | 'settings';
}

export const useAppBackHandler = ({
  currentStep,
  setCurrentStep,
  activeTab,
  setActiveTab,
  focusConfigOrigin,
}: UseAppBackHandlerProps) => {
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep === 'wallpaper' || currentStep === 'settings') {
        setCurrentStep('main');
        return true;
      }
      if (currentStep === 'focus-config') {
        setCurrentStep(focusConfigOrigin);
        return true;
      }
      if (
        currentStep === 'azan-prefs' ||
        currentStep === 'privacy-policy' ||
        currentStep === 'terms'
      ) {
        setCurrentStep('settings');
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
  }, [currentStep, activeTab, focusConfigOrigin, setCurrentStep, setActiveTab]);
};

