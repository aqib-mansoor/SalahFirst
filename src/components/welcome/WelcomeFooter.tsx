import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, WELCOME_THEME } from '@/constants/theme';
import { AppButton, AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface WelcomeFooterProps {
  onContinue: () => void;
}

export const WelcomeFooter: React.FC<WelcomeFooterProps> = ({ onContinue }) => {
  const { t } = useTranslation();

  const ChevronRight = (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={WELCOME_THEME.buttonText}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppButton
        label={t('continueToSetup')}
        onPress={onContinue}
        variant="gold"
        size="lg"
        textColor={WELCOME_THEME.buttonText}
        rightIcon={ChevronRight}
        style={styles.button}
      />

      <AppText
        variant="caption"
        color={WELCOME_THEME.badge}
        align="center"
        style={styles.privacyBadge}
      >
        {t('welcomePrivacyBadge')}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  button: {
    width: '100%',
    borderRadius: 18,
  },
  privacyBadge: {
    letterSpacing: 0.2,
  },
});
