import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { calculateQiblaBearing } from '@/utils/qiblaCalculations';
import { getDefaultMethodForCountry } from '@/utils/prayerTimes';
import { useTranslation } from '@/context/LocalizationContext';

export interface SetupCityModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: PresetCity) => void;
}

export const SetupCityModal: React.FC<SetupCityModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const filtered = PRESET_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(trimmedQuery.toLowerCase())
  );

  const hasExactMatch = PRESET_CITIES.some(
    (c) => c.name.toLowerCase() === trimmedQuery.toLowerCase()
  );

  const handleCustomGeocode = async () => {
    if (trimmedQuery.length < 2) return;
    setIsGeocoding(true);
    setErrorMessage(null);

    try {
      const results = await Location.geocodeAsync(trimmedQuery);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        let cityName = trimmedQuery;
        let countryName = 'Custom Location';

        try {
          const rev = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (rev && rev.length > 0) {
            cityName = rev[0].city || rev[0].name || rev[0].subregion || trimmedQuery;
            countryName = rev[0].country || countryName;
          }
        } catch {}

        const customCity: PresetCity = {
          id: `custom-${Date.now()}`,
          name: cityName,
          country: countryName,
          latitude,
          longitude,
          qiblaDegrees: calculateQiblaBearing(latitude, longitude),
          methodName: getDefaultMethodForCountry(countryName),
        };

        onSelect(customCity);
        setQuery('');
        setErrorMessage(null);
        onClose();
      } else {
        setErrorMessage(
          t('couldNotResolveCity', { city: trimmedQuery })
        );
      }
    } catch {
      setErrorMessage(
        t('unableToSearchOnline', { city: trimmedQuery })
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleClose = () => {
    setQuery('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <AppText variant="titleMedium" color={theme.colors.text}>
              {t('selectCity')}
            </AppText>
            <Pressable onPress={handleClose} hitSlop={12}>
              <AppText variant="bodyMedium" color={theme.colors.textMuted}>
                {t('close')}
              </AppText>
            </Pressable>
          </View>

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

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  handleClose();
                }}
                style={({ pressed }) => [
                  styles.cityItem,
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
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
  cityItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
});
