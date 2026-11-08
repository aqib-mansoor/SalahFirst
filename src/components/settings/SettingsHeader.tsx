import React from 'react';
import { ScreenHeader } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface SettingsHeaderProps {
  onBack: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <ScreenHeader
      title={t('settingsTitle') as string}
      subtitle="Offline preferences • Stored on device"
      onBack={onBack}
      backAccessibilityLabel="Back to Home"
    />
  );
};
