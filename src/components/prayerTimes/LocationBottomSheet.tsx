import React, { useState } from 'react';
import { Modal, StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
import { useDeviceLocation } from '@/hooks/useDeviceLocation';

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
  const [search, setSearch] = useState('');
  const [onlineCities, setOnlineCities] = useState<PresetCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<string | null>(null);
  const [pendingCity, setPendingCity] = useState<PresetCity | null>(null);

  const currentCountry = propCountry || deviceLoc?.country;
  const currentTimezone = propTimezone || deviceLoc?.timezone;

  const trimmed = search.trim().toLowerCase();
  const filteredPresets = trimmed
    ? PRESET_CITIES.filter((c) => c.name.toLowerCase().includes(trimmed) || c.country.toLowerCase().includes(trimmed))
    : PRESET_CITIES;
  const displayCities = [...filteredPresets, ...onlineCities];

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
            {/* Top Grab Handle */}
            <View style={styles.handleWrap}>
              <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Header Row */}
            <View style={styles.headerRow}>
              <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
                {t('selectCity')}
              </AppText>
              <Pressable
                onPress={handleClose}
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

            {/* Pinned Top GPS Card */}
            {onUseGps && (
              <LocationGpsPinnedCard
                isGps={isGps}
                onPress={() => {
                  onUseGps();
                  handleClose();
                }}
              />
            )}

            {/* Search Input Bar & Online Lookup */}
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

            {/* Scrollable Cities List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
              {displayCities.map((city) => {
                const isSelected = !isGps && city.name.toLowerCase() === currentCityName.toLowerCase();
                return (
                  <LocationCityRow
                    key={city.id}
                    city={city}
                    isSelected={isSelected}
                    onSelect={handleCitySelect}
                  />
                );
              })}
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
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: SPACING.xs + 2,
    paddingBottom: SPACING.lg,
  },
});
