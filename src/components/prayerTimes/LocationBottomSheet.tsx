import React, { useState, useMemo } from 'react';
import { Modal, StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { searchWorldwideCity } from '@/utils/geocoding';
import { LocationCityRow } from './LocationCityRow';
import { LocationGpsPinnedCard } from './LocationGpsPinnedCard';
import { LocationSearchBar } from './LocationSearchBar';
import { LocationChangeConfirmModal } from './LocationChangeConfirmModal';
import { LocationSheetHeader } from './LocationSheetHeader';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { CityModalCountryRow } from '@/components/setup/CityModalCountryRow';

export interface LocationBottomSheetProps {
  visible: boolean;
  currentCityName: string;
  isGps?: boolean;
  onClose: () => void;
  onSelectCity: (city: PresetCity) => void;
  onUseGps?: () => void;
  currentCountry?: string;
  currentTimezone?: string;
}

export const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  visible,
  currentCityName,
  isGps = false,
  onClose,
  onSelectCity,
  onUseGps,
  currentCountry: propCountry,
  currentTimezone: propTimezone,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { location: deviceLoc } = useDeviceLocation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlineCities, setOnlineCities] = useState<PresetCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<string | null>(null);
  const [pendingCity, setPendingCity] = useState<PresetCity | null>(null);

  const currentCountry = propCountry || deviceLoc?.country;
  const currentTimezone = propTimezone || deviceLoc?.timezone;

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

  const trimmed = search.trim().toLowerCase();
  const filteredPresets = trimmed
    ? PRESET_CITIES.filter((c) => c.name.toLowerCase().includes(trimmed) || c.country.toLowerCase().includes(trimmed))
    : PRESET_CITIES;
  const displayCities = [...filteredPresets, ...onlineCities];

  const countryCities = useMemo(() => {
    if (!selectedCountry) return [];
    return PRESET_CITIES.filter((c) => c.country === selectedCountry);
  }, [selectedCountry]);

  const handleOnlineSearch = async () => {
    if (trimmed.length < 2) return;
    setIsSearching(true);
    setOnlineError(null);
    setAttribution(null);
    const result = await searchWorldwideCity(search);
    setIsSearching(false);
    if (result.isOffline) {
      setOnlineError(t('unableToSearchOnline', { city: search.trim() }));
    } else if (result.cities.length === 0) {
      setOnlineError(t('couldNotResolveCity', { city: search.trim() }));
    } else {
      setOnlineCities(result.cities);
      if (result.attribution) setAttribution(result.attribution);
    }
  };

  const handleClose = () => {
    setSearch('');
    setSelectedCountry(null);
    setOnlineCities([]);
    setOnlineError(null);
    setAttribution(null);
    setPendingCity(null);
    onClose();
  };

  const handleCitySelect = (city: PresetCity) => {
    const isSelected = !isGps && city.name.toLowerCase() === currentCityName.toLowerCase();
    if (isSelected) {
      handleClose();
      return;
    }
    setPendingCity(city);
  };

  const handleConfirmLocationChange = (city: PresetCity) => {
    setPendingCity(null);
    onSelectCity(city);
    handleClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />

          <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
            <LocationSheetHeader
              selectedCountry={selectedCountry}
              isSearching={Boolean(trimmed)}
              onBackToCountries={() => setSelectedCountry(null)}
              onClose={handleClose}
            />

            {selectedCountry && !trimmed && (
              <View style={[styles.activeCountryBanner, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
                <AppText variant="titleSmall" color={theme.colors.text}>
                  {selectedCountry}
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {countryCities.length} verified cities
                </AppText>
              </View>
            )}

            {onUseGps && !selectedCountry && !trimmed && (
              <LocationGpsPinnedCard
                isGps={isGps}
                onPress={() => {
                  onUseGps();
                  handleClose();
                }}
              />
            )}

            <LocationSearchBar
              search={search}
              isSearching={isSearching}
              onlineError={onlineError}
              attribution={attribution}
              onSearchChange={(txt) => {
                setSearch(txt);
                setOnlineError(null);
              }}
              onClear={() => setSearch('')}
              onSubmit={handleOnlineSearch}
              onOnlineSearch={handleOnlineSearch}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
              {trimmed ? (
                displayCities.map((city) => (
                  <LocationCityRow
                    key={city.id}
                    city={city}
                    isSelected={!isGps && city.name.toLowerCase() === currentCityName.toLowerCase()}
                    onSelect={handleCitySelect}
                  />
                ))
              ) : selectedCountry ? (
                countryCities.map((city) => (
                  <LocationCityRow
                    key={city.id}
                    city={city}
                    isSelected={!isGps && city.name.toLowerCase() === currentCityName.toLowerCase()}
                    onSelect={handleCitySelect}
                  />
                ))
              ) : (
                countries.map((item) => (
                  <CityModalCountryRow
                    key={item.country}
                    country={item.country}
                    cityCount={item.cityCount}
                    onPress={() => setSelectedCountry(item.country)}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <LocationChangeConfirmModal
        visible={!!pendingCity}
        currentCityName={currentCityName}
        currentCountry={currentCountry}
        currentTimezone={currentTimezone}
        destinationCity={pendingCity}
        onConfirm={handleConfirmLocationChange}
        onCancel={() => setPendingCity(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    maxHeight: '80%',
    gap: SPACING.sm,
  },
  activeCountryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  list: {
    gap: SPACING.xs + 2,
    paddingBottom: SPACING.lg,
  },
});
