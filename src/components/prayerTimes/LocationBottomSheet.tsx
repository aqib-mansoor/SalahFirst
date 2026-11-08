import React, { useState } from 'react';
import { Modal, StyleSheet, View, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { searchWorldwideCity } from '@/utils/geocoding';
import { LocationCityRow } from './LocationCityRow';

export interface LocationBottomSheetProps {
  visible: boolean;
  currentCityName: string;
  isGps?: boolean;
  onClose: () => void;
  onSelectCity: (city: PresetCity) => void;
  onUseGps?: () => void;
}

export const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  visible,
  currentCityName,
  isGps = false,
  onClose,
  onSelectCity,
  onUseGps,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [onlineCities, setOnlineCities] = useState<PresetCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<string | null>(null);

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
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
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
              style={styles.closeBtn}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.textMuted} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          {/* Search Input */}
          <TextInput
            value={search}
            onChangeText={(txt) => {
              setSearch(txt);
              setOnlineError(null);
            }}
            onSubmitEditing={handleOnlineSearch}
            placeholder={t('searchCityOrCountry')}
            placeholderTextColor={theme.colors.textMuted}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.surfaceElevated,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
          />

          {onlineError && (
            <AppText variant="caption" color={theme.colors.error} style={{ marginHorizontal: SPACING.xs }}>
              {onlineError}
            </AppText>
          )}

          {trimmed.length >= 2 && !isSearching && (
            <Pressable
              onPress={handleOnlineSearch}
              style={[styles.onlineSearchBtn, { backgroundColor: theme.colors.mintTint }]}
            >
              <AppText variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                Search worldwide for "{search.trim()}"
              </AppText>
            </Pressable>
          )}

          {attribution && (
            <AppText variant="caption" color={theme.colors.textMuted} style={{ fontSize: 10, textAlign: 'center' }}>
              {attribution}
            </AppText>
          )}

          {isSearching && (
            <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: SPACING.xs }} />
          )}

          {/* Cities List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {/* GPS Option */}
            {onUseGps && !trimmed && (
              <Pressable
                onPress={() => {
                  onUseGps();
                  handleClose();
                }}
                accessibilityRole="button"
                accessibilityLabel="Use Live Device GPS"
                accessibilityState={{ selected: isGps }}
                style={({ pressed }) => [
                  styles.gpsCard,
                  {
                    backgroundColor: isGps ? theme.colors.bannerGreen : theme.colors.surfaceElevated,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View style={styles.gpsInfo}>
                  <AppText
                    variant="titleSmall"
                    color={isGps ? theme.colors.bannerGreenText : theme.colors.text}
                    style={styles.gpsName}
                  >
                    {t('useLiveGps')}
                  </AppText>
                  <AppText
                    variant="caption"
                    color={isGps ? theme.colors.accentLight : theme.colors.textMuted}
                    style={styles.gpsText}
                  >
                    {t('automaticGps')}
                  </AppText>
                </View>

                {isGps && (
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 13l4 4L19 7" stroke={theme.colors.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </Pressable>
            )}

            {displayCities.map((city) => {
              const isSelected =
                !isGps && city.name.toLowerCase() === currentCityName.toLowerCase();

              return (
                <LocationCityRow
                  key={city.id}
                  city={city}
                  isSelected={isSelected}
                  onSelect={(c) => {
                    onSelectCity(c);
                    handleClose();
                  }}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  backdrop: { flex: 1 },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: '75%',
    gap: SPACING.sm,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: '800' },
  closeBtn: { padding: SPACING.xs },
  searchInput: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  onlineSearchBtn: {
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  list: { gap: SPACING.sm, paddingBottom: SPACING.md },
  gpsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  gpsInfo: { gap: 2, flex: 1 },
  gpsName: { fontWeight: '700' },
  gpsText: { fontWeight: '500' },
});
