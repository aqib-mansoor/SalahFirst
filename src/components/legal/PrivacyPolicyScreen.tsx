import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { TranslationKey } from '@/i18n';
import { LegalHeader } from './LegalHeader';
import { LegalSectionCard } from './LegalSectionCard';

export interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

interface SectionKeyItem {
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  highlight?: boolean;
}

const SECTION_KEYS: SectionKeyItem[] = [
  { titleKey: 'ppSection1Title', bodyKey: 'ppSection1Body', highlight: true },
  { titleKey: 'ppSection2Title', bodyKey: 'ppSection2Body' },
  { titleKey: 'ppSection3Title', bodyKey: 'ppSection3Body' },
  { titleKey: 'ppSection4Title', bodyKey: 'ppSection4Body' },
  { titleKey: 'ppSection5Title', bodyKey: 'ppSection5Body' },
  { titleKey: 'ppSection6Title', bodyKey: 'ppSection6Body' },
  { titleKey: 'ppSection7Title', bodyKey: 'ppSection7Body' },
  { titleKey: 'ppSection8Title', bodyKey: 'ppSection8Body' },
  { titleKey: 'ppSection9Title', bodyKey: 'ppSection9Body' },
  { titleKey: 'ppSection10Title', bodyKey: 'ppSection10Body' },
  { titleKey: 'ppSection11Title', bodyKey: 'ppSection11Body' },
  { titleKey: 'ppSection12Title', bodyKey: 'ppSection12Body' },
  { titleKey: 'ppSection13Title', bodyKey: 'ppSection13Body' },
  { titleKey: 'ppSection14Title', bodyKey: 'ppSection14Body' },
  { titleKey: 'ppSection15Title', bodyKey: 'ppSection15Body' },
];

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <AppContainer
      edges={['top', 'left', 'right', 'bottom']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <LegalHeader
        title={t('privacyPolicyMenuTitle')}
        subtitle={t('lastUpdatedDate')}
        onBack={onBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SECTION_KEYS.map((s, index) => (
          <LegalSectionCard
            key={index}
            title={t(s.titleKey)}
            body={t(s.bodyKey)}
            highlight={s.highlight}
          />
        ))}
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
});
