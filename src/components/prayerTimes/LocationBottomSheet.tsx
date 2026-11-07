import React, { useState } from 'react';
import { Modal, StyleSheet, View, Pressable, ScrollView, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

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

  const trimmed = search.trim().toLowerCase();
  const filteredCities = trimmed
    ? PRESET_CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.country.toLowerCase().includes(trimmed)
      )
    : PRESET_CITIES;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
              {t('selectCity')}
            </AppText>
            <Pressable
              onPress={onClose}
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
            onChangeText={setSearch}
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

          {/* Cities List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {/* GPS Option */}
            {onUseGps && !trimmed && (
              <Pressable
                onPress={() => {
                  onUseGps();
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel="Use Live Device GPS"
                accessibilityState={{ selected: isGps }}
                style={({ pressed }) => [
                  styles.cityCard,
                  {
                    backgroundColor: isGps ? theme.colors.bannerGreen : theme.colors.surfaceElevated,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View style={styles.cityInfo}>
                  <AppText
                    variant="titleSmall"
                    color={isGps ? theme.colors.bannerGreenText : theme.colors.text}
                    style={styles.cityName}
                  >
                    {t('useLiveGps')}
                  </AppText>
                  <AppText
                    variant="caption"
                    color={isGps ? theme.colors.accentLight : theme.colors.textMuted}
                    style={styles.qiblaText}
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

            {filteredCities.map((city) => {
              const isSelected =
                !isGps && city.name.toLowerCase() === currentCityName.toLowerCase();

              const cardBg = isSelected ? theme.colors.bannerGreen : theme.colors.surfaceElevated;
              const textColor = isSelected ? theme.colors.bannerGreenText : theme.colors.text;
              const subtextColor = isSelected ? theme.colors.accentLight : theme.colors.textMuted;

              return (
                <Pressable
                  key={city.id}
                  onPress={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${city.name}, ${city.country}, Qibla angle ${city.qiblaDegrees} degrees`}
                  accessibilityState={{ selected: isSelected }}
                  style={({ pressed }) => [
                    styles.cityCard,
                    {
                      backgroundColor: cardBg,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View style={styles.cityInfo}>
                    <AppText variant="titleSmall" color={textColor} style={styles.cityName}>
                      {city.name}, {city.country}
                    </AppText>
                    <AppText variant="caption" color={subtextColor} style={styles.qiblaText}>
                      Qibla: {city.qiblaDegrees}° • {city.methodName}
                    </AppText>
                  </View>

                  {isSelected && (
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Path d="M5 13l4 4L19 7" stroke={theme.colors.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: '75%',
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  list: {
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  cityInfo: {
    gap: 2,
    flex: 1,
  },
  cityName: {
    fontWeight: '700',
  },
  qiblaText: {
    fontWeight: '500',
  },
});
