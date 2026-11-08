import React from 'react';
import { ScreenHeader } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface AzanPrefsHeaderProps {
  onBack: () => void;
}

export const AzanPrefsHeader: React.FC<AzanPrefsHeaderProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <ScreenHeader
      title={t('notificationsAndReminders') as string}
      subtitle={t('customizeAlerts') as string}
      onBack={onBack}
      backAccessibilityLabel="Back to prayer times"
    />
  );
};
