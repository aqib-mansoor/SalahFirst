import React from 'react';
import { Modal, StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { UserLocation } from '@/types';

export interface LocationBottomSheetProps {
  visible: boolean;
  currentCityName: string;
  onClose: () => void;
  onSelectCity: (city: PresetCity) => void;
}

export const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  visible,
  currentCityName,
  onClose,
  onSelectCity,
}) => {
  const theme = useTheme('light');

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
              Select Your Location
            </AppText>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.textMuted} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          {/* Subtitle */}
          <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.subtitle}>
            Choose a city manually for offline prayer calculation and Qibla angle:
          </AppText>

          {/* Cities List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {PRESET_CITIES.map((city) => {
              const isSelected =
                city.name.toLowerCase() === currentCityName.toLowerCase();

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
    padding: SPACING.xl,
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
    padding: 4,
  },
  subtitle: {
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  list: {
    gap: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  cityInfo: {
    gap: 4,
    flex: 1,
  },
  cityName: {
    fontWeight: '700',
  },
  qiblaText: {
    fontSize: 11,
  },
});

