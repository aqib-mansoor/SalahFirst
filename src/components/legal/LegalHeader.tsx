import React from 'react';
import { ScreenHeader } from '@/components/common';

export interface LegalHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => {
  return (
    <ScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      backAccessibilityLabel="Go back"
    />
  );
};
