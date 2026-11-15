import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { searchWorldwideCity } from '@/utils/geocoding';
import { CityModalHeader } from './CityModalHeader';
import { CityModalSearchBox } from './CityModalSearchBox';
import { CityModalCountryRow } from './CityModalCountryRow';
import { CityModalCityRow } from './CityModalCityRow';

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

  const handleCityPick = (city: PresetCity) => {
    onSelect(city);
    handleClose();
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={handleClose}
      maxHeight="80%"
      minHeight={360}
      containerStyle={styles.sheetOverride}
    >
      <CityModalHeader
        isCountrySelected={Boolean(selectedCountry)}
        hasQuery={Boolean(trimmedQuery)}
        onBackToCountries={() => setSelectedCountry(null)}
        onClose={handleClose}
      />

      {selectedCountry && !trimmedQuery && (
        <View style={[styles.activeCountryBanner, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
          <AppText variant="titleSmall" color={theme.colors.text}>
            {selectedCountry}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {countryCities.length} {t('verifiedCities')}
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

      <CityModalSearchBox
        query={query}
        onChangeQuery={(text) => {
          setQuery(text);
          if (errorMessage) setErrorMessage(null);
        }}
        errorMessage={errorMessage}
        hasExactMatch={hasExactMatch}
        isGeocoding={isGeocoding}
        onCustomGeocode={handleCustomGeocode}
      />

      {trimmedQuery ? (
        <FlatList
          data={searchFilteredCities}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CityModalCityRow city={item} onPress={() => handleCityPick(item)} />
          )}
        />
      ) : selectedCountry ? (
        <FlatList
          data={countryCities}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CityModalCityRow
              city={item}
              subtitle={`Qibla ${item.qiblaDegrees}° • ${item.methodName}`}
              onPress={() => handleCityPick(item)}
            />
          )}
        />
      ) : (
        <FlatList
          data={countries}
          keyExtractor={(item) => item.country}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CityModalCountryRow
              country={item.country}
              cityCount={item.cityCount}
              onPress={() => setSelectedCountry(item.country)}
            />
          )}
        />
      )}
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetOverride: {
    paddingHorizontal: SPACING.xl,
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
});
