import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { FocusDuration } from '@/types';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { AppStep } from '@/hooks/useAppBackHandler';
import {
  getActiveFocusSession,
  FocusSession,
  createFocusSession,
  saveActiveFocusSession,
} from '@/utils/focusSession';
import { stopAzanAudio } from '@/utils/azanAudio';

export interface UseNotificationResponseRouterParams {
  setCurrentStep: (step: AppStep) => void;
  setActiveTab: (tab: HomeTab) => void;
  setActiveSession: (session: FocusSession | null) => void;
  setFocusPrayerName: (name: string) => void;
  setFocusDuration: (duration: FocusDuration) => void;
}

export const useNotificationResponseRouter = ({
  setCurrentStep,
  setActiveTab,
  setActiveSession,
  setFocusPrayerName,
  setFocusDuration,
}: UseNotificationResponseRouterParams) => {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        type?: string;
        prayerName?: string;
        duration?: FocusDuration;
        targetEndTimestamp?: number;
      } | null;

      if (!data) return;

      if (response.actionIdentifier === 'DISMISS_AZAN') {
        stopAzanAudio();
        return;
      }

      if (response.actionIdentifier === 'START_FOCUS' && data.prayerName) {
        stopAzanAudio();
        const prayer = String(data.prayerName);
        const session = createFocusSession(prayer, 15);
        saveActiveFocusSession(session);
        setActiveSession(session);
        setFocusPrayerName(prayer);
        setFocusDuration(15);
        setCurrentStep('focus-active');
        return;
      }

      if (data.type === 'focus-breach' || data.type === 'focus-active') {
        getActiveFocusSession().then((session) => {
          if (session) {
            setActiveSession(session);
            setFocusPrayerName(session.prayerName);
            setFocusDuration(session.durationMinutes);
          } else if (data.prayerName) {
            setFocusPrayerName(String(data.prayerName));
          }
          setCurrentStep('focus-active');
        });
      } else if (data.type === 'auto-focus-start' && data.prayerName) {
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
      } else if (data.prayerName) {
        setFocusPrayerName(String(data.prayerName));
        setCurrentStep('focus-config');
      } else if (data.type === 'daily-inspiration') {
        setCurrentStep('main');
        setActiveTab('hadith');
      } else if (data.type === 'reengagement') {
        setCurrentStep('main');
        setActiveTab('home');
      }
    });

    return () => subscription.remove();
  }, [setCurrentStep, setActiveTab, setActiveSession, setFocusPrayerName, setFocusDuration]);
};

