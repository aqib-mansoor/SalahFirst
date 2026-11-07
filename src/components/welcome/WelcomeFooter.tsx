import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { APP_CONFIG } from '@/constants/config';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppButton, AppText } from '@/components/common';

export interface WelcomeFooterProps {
  onContinue: () => void;
}

export const WelcomeFooter: React.FC<WelcomeFooterProps> = ({ onContinue }) => {
  const theme = useTheme();

  const ChevronRight = (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={theme.colors.buttonGoldText}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppButton
        label={APP_CONFIG.continueButton}
        onPress={onContinue}
        size="lg"
        rightIcon={ChevronRight}
        style={styles.button}
      />

      <AppText
        variant="caption"
        color={theme.colors.textSubtle}
        align="center"
        style={styles.privacyBadge}
      >
        {APP_CONFIG.privacyBadge}
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

