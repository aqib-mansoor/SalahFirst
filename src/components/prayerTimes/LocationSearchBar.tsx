import React from 'react';
import { StyleSheet, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface LocationSearchBarProps {
  search: string;
  isSearching: boolean;
  onlineError: string | null;
  attribution: string | null;
  onSearchChange: (text: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  onOnlineSearch: () => void;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  search,
  isSearching,
  onlineError,
  attribution,
  onSearchChange,
  onClear,
  onSubmit,
  onOnlineSearch,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const trimmed = search.trim();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={theme.colors.textMuted} strokeWidth="2" />
          <Path d="M20 20l-3.5-3.5" stroke={theme.colors.textMuted} strokeWidth="2" strokeLinecap="round" />
        </Svg>

        <TextInput
          value={search}
          onChangeText={onSearchChange}
          onSubmitEditing={onSubmit}
          placeholder={t('searchCityOrCountry')}
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.searchInput, { color: theme.colors.text }]}
        />

        {search.length > 0 && (
          <Pressable onPress={onClear} hitSlop={8}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.textMuted} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </Pressable>
        )}
      </View>

      {onlineError && (
        <AppText variant="caption" color={theme.colors.error} style={styles.errorText}>
          {onlineError}
        </AppText>
      )}

      {trimmed.length >= 2 && !isSearching && (
        <Pressable
          onPress={onOnlineSearch}
          style={({ pressed }) => [
            styles.onlineSearchBtn,
            {
              backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.secondaryTint,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={theme.colors.primary} strokeWidth="1.8" />
            <Path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke={theme.colors.primary} strokeWidth="1.8" />
          </Svg>
          <AppText variant="caption" color={theme.colors.primary} style={styles.onlineSearchText}>
            {t('searchWorldwideFor', { city: trimmed })}
          </AppText>
        </Pressable>
      )}

      {attribution && (
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.attributionText}>
          {attribution}
        </AppText>
      )}

      {isSearching && (
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: SPACING.xs }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 2,
  },
  onlineSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  onlineSearchText: {
    fontWeight: '700',
    fontSize: 12,
  },
  errorText: {
    marginHorizontal: SPACING.xs,
  },
  attributionText: {
    fontSize: 10,
    textAlign: 'center',
  },
});

