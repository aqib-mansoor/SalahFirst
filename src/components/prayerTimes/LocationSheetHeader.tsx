import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface LocationSheetHeaderProps {
  selectedCountry: string | null;
  isSearching: boolean;
  onBackToCountries: () => void;
  onClose: () => void;
}

export const LocationSheetHeader: React.FC<LocationSheetHeaderProps> = ({
  selectedCountry,
  isSearching,
  onBackToCountries,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      {/* Top Grab Handle */}
      <View style={styles.handleWrap}>
        <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
      </View>

      {/* Header Row */}
      <View style={styles.headerRow}>
        {selectedCountry && !isSearching ? (
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
          <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
            {isSearching ? t('selectCity') : t('selectCountry')}
          </AppText>
        )}

        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close location selection"
          style={[styles.closeBtn, { backgroundColor: theme.colors.surfaceElevated }]}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.text} strokeWidth="2.2" strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  handleWrap: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.xs,
  },
  title: {
    fontWeight: '800',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontWeight: '700',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
