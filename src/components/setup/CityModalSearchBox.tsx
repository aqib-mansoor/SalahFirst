import React from 'react';
import { StyleSheet, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface CityModalSearchBoxProps {
  query: string;
  onChangeQuery: (text: string) => void;
  errorMessage: string | null;
  hasExactMatch: boolean;
  isGeocoding: boolean;
  onCustomGeocode: () => void;
}

export const CityModalSearchBox: React.FC<CityModalSearchBoxProps> = ({
  query,
  onChangeQuery,
  errorMessage,
  hasExactMatch,
  isGeocoding,
  onCustomGeocode,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const trimmed = query.trim();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('searchCityOrCountry')}
        placeholderTextColor={theme.colors.textSubtle}
        value={query}
        onChangeText={onChangeQuery}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceElevated,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
      />

      {errorMessage && (
        <View style={[styles.errorBox, { backgroundColor: theme.colors.surfaceElevated }]}>
          <AppText variant="caption" color={theme.colors.error}>
            {errorMessage}
          </AppText>
        </View>
      )}

      {trimmed.length > 1 && !hasExactMatch && (
        <Pressable
          onPress={onCustomGeocode}
          disabled={isGeocoding}
          style={({ pressed }) => [
            styles.customCityBox,
            {
              backgroundColor: pressed ? theme.colors.mintTintPressed : theme.colors.mintTint,
              opacity: isGeocoding ? 0.7 : 1,
            },
          ]}
        >
          {isGeocoding ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <AppText variant="titleSmall" color={theme.colors.primary}>
              + Search online coordinates for "{trimmed}"
            </AppText>
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xs,
  },
  input: {
    height: 48,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
    fontSize: 14,
  },
  errorBox: {
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  customCityBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
