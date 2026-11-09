import React, { useState, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { searchWorldwideCity } from '@/utils/geocoding';

export interface SetupCityModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: PresetCity) => void;
  requiredNotice?: string;
}

export const SetupCityModal: React.FC<SetupCityModalProps> = ({
  visible,
  onClose,
  onSelect,
  requiredNotice,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const countries = useMemo(() => {
    const map = new Map<string, number>();
    PRESET_CITIES.forEach((c) => {
      map.set(c.country, (map.get(c.country) || 0) + 1);
    });
    return Array.from(map.entries()).map(([country, count]) => ({
      country,
      cityCount: count,
    }));
  }, []);

  const trimmedQuery = query.trim();

  const searchFilteredCities = useMemo(() => {
    if (!trimmedQuery) return [];
    const q = trimmedQuery.toLowerCase();
    return PRESET_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [trimmedQuery]);

  const countryCities = useMemo(() => {
    if (!selectedCountry) return [];
    return PRESET_CITIES.filter((c) => c.country === selectedCountry);
  }, [selectedCountry]);

  const hasExactMatch = PRESET_CITIES.some(
    (c) => c.name.toLowerCase() === trimmedQuery.toLowerCase()
  );

  const handleCustomGeocode = async () => {
    if (trimmedQuery.length < 2) return;
    setIsGeocoding(true);
    setErrorMessage(null);

    const result = await searchWorldwideCity(trimmedQuery);
    setIsGeocoding(false);

    if (result.isOffline) {
      setErrorMessage(t('unableToSearchOnline', { city: trimmedQuery }));
    } else if (result.cities.length === 0) {
      setErrorMessage(t('couldNotResolveCity', { city: trimmedQuery }));
    } else {
      onSelect(result.cities[0]);
      handleClose();
    }
  };

  const handleClose = () => {
    setQuery('');
    setSelectedCountry(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {selectedCountry && !trimmedQuery ? (
                <Pressable
                  onPress={() => setSelectedCountry(null)}
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
                  {trimmedQuery ? t('selectCity') : t('selectCountry')}
                </AppText>
              )}
            </View>

            <Pressable onPress={handleClose} hitSlop={12}>
              <AppText variant="bodyMedium" color={theme.colors.textMuted}>
                {t('close')}
              </AppText>
            </Pressable>
          </View>

          {/* Active Selection Banner if inside a country */}
          {selectedCountry && !trimmedQuery && (
            <View style={[styles.activeCountryBanner, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
              <AppText variant="titleSmall" color={theme.colors.text}>
                {selectedCountry}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {countryCities.length} verified cities
              </AppText>
            </View>
          )}

          {requiredNotice && (
            <View style={[styles.noticeBox, { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent }]}>
              <AppText variant="caption" color={theme.colors.textPrimary}>
                {requiredNotice}
              </AppText>
            </View>
          )}

          {/* Search Bar */}
          <TextInput
            placeholder={t('searchCityOrCountry')}
            placeholderTextColor={theme.colors.textSubtle}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (errorMessage) setErrorMessage(null);
            }}
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

          {/* Custom Online Geocode Button */}
          {trimmedQuery.length > 1 && !hasExactMatch && (
            <Pressable
              onPress={handleCustomGeocode}
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
                  + Search online coordinates for "{trimmedQuery}"
                </AppText>
              )}
            </Pressable>
          )}

          {/* List: 1. Search Results OR 2. Selected Country Cities OR 3. Countries List */}
          {trimmedQuery ? (
            <FlatList
              data={searchFilteredCities}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    handleClose();
                  }}
                  style={({ pressed }) => [
                    styles.listItem,
                    {
                      borderBottomColor: theme.colors.border,
                      backgroundColor: pressed ? theme.colors.mintTint : 'transparent',
                    },
                  ]}
                >
                  <AppText variant="titleSmall" color={theme.colors.text}>
                    {item.name}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {item.country} • Qibla {item.qiblaDegrees}°
                  </AppText>
                </Pressable>
              )}
            />
          ) : selectedCountry ? (
            <FlatList
              data={countryCities}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    handleClose();
                  }}
                  style={({ pressed }) => [
                    styles.listItem,
                    {
                      borderBottomColor: theme.colors.border,
                      backgroundColor: pressed ? theme.colors.mintTint : 'transparent',
                    },
                  ]}
                >
                  <AppText variant="titleSmall" color={theme.colors.text}>
                    {item.name}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    Qibla {item.qiblaDegrees}° • {item.methodName}
                  </AppText>
                </Pressable>
              )}
            />
          ) : (
            <FlatList
              data={countries}
              keyExtractor={(item) => item.country}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedCountry(item.country)}
                  style={({ pressed }) => [
                    styles.listItem,
                    styles.countryItem,
                    {
                      borderBottomColor: theme.colors.border,
                      backgroundColor: pressed ? theme.colors.mintTint : 'transparent',
                    },
                  ]}
                >
                  <View>
                    <AppText variant="titleSmall" color={theme.colors.text}>
                      {item.country}
                    </AppText>
                    <AppText variant="caption" color={theme.colors.textMuted}>
                      {item.cityCount} {item.cityCount === 1 ? 'city' : 'cities'}
                    </AppText>
                  </View>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 18L15 12L9 6"
                      stroke={theme.colors.textMuted}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl,
    maxHeight: '80%',
    minHeight: 440,
  },
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
  activeCountryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  noticeBox: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
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
  listItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
