import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { TranslationKey } from '@/i18n';
import { LegalHeader } from './LegalHeader';
import { LegalSectionCard } from './LegalSectionCard';

export interface TermsScreenProps {
  onBack: () => void;
}

interface SectionKeyItem {
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  highlight?: boolean;
}

const SECTION_KEYS: SectionKeyItem[] = [
  { titleKey: 'tcSection1Title', bodyKey: 'tcSection1Body', highlight: true },
  { titleKey: 'tcSection2Title', bodyKey: 'tcSection2Body' },
  { titleKey: 'tcSection3Title', bodyKey: 'tcSection3Body' },
  { titleKey: 'tcSection4Title', bodyKey: 'tcSection4Body' },
  { titleKey: 'tcSection5Title', bodyKey: 'tcSection5Body' },
  { titleKey: 'tcSection6Title', bodyKey: 'tcSection6Body' },
  { titleKey: 'tcSection7Title', bodyKey: 'tcSection7Body' },
  { titleKey: 'tcSection8Title', bodyKey: 'tcSection8Body' },
  { titleKey: 'tcSection9Title', bodyKey: 'tcSection9Body' },
  { titleKey: 'tcSection10Title', bodyKey: 'tcSection10Body' },
  { titleKey: 'tcSection11Title', bodyKey: 'tcSection11Body' },
  { titleKey: 'tcSection12Title', bodyKey: 'tcSection12Body' },
  { titleKey: 'tcSection13Title', bodyKey: 'tcSection13Body' },
  { titleKey: 'tcSection14Title', bodyKey: 'tcSection14Body' },
  { titleKey: 'tcSection15Title', bodyKey: 'tcSection15Body' },
];

export const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <AppContainer
      edges={['top', 'left', 'right', 'bottom']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <LegalHeader
        title={t('termsMenuTitle')}
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
