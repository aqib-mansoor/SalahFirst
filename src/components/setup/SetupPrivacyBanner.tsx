import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export const SetupPrivacyBanner: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.privacyBg,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="11" width="16" height="11" rx="2" stroke={theme.colors.primary} strokeWidth="2" />
        <Path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke={theme.colors.primary} strokeWidth="2" />
      </Svg>

      <AppText variant="bodySmall" color={theme.colors.privacyText} style={styles.text}>
        {t('noLoginRequired')}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
    marginVertical: SPACING.xs,
  },
  text: {
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
});

