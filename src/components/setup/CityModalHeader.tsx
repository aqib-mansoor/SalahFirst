import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface CityModalHeaderProps {
  isCountrySelected: boolean;
  hasQuery: boolean;
  onBackToCountries: () => void;
  onClose: () => void;
}

export const CityModalHeader: React.FC<CityModalHeaderProps> = ({
  isCountrySelected,
  hasQuery,
  onBackToCountries,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {isCountrySelected && !hasQuery ? (
          <Pressable
            onPress={onBackToCountries}
            hitSlop={8}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back to countries"
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18L9 12L15 6"
                stroke={theme.colors.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <AppText variant="bodySmall" color={theme.colors.primary} style={styles.backText}>
              {t('backToCountries')}
            </AppText>
          </Pressable>
        ) : (
          <AppText variant="titleMedium" color={theme.colors.text}>
            {hasQuery ? t('selectCity') : t('selectCountry')}
          </AppText>
        )}
      </View>

      <Pressable onPress={onClose} hitSlop={12}>
        <AppText variant="bodyMedium" color={theme.colors.textMuted}>
          {t('close')}
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontWeight: '700',
  },
});

