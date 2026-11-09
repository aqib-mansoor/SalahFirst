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

    const result = await searchWorldwideCity(trimmedQuery);
    setIsGeocoding(false);

    if (result.isOffline) {
      setErrorMessage(t('unableToSearchOnline', { city: trimmedQuery }));
    } else if (result.cities.length === 0) {
      setErrorMessage(t('couldNotResolveCity', { city: trimmedQuery }));
    } else {
      onSelect(result.cities[0]);
      setQuery('');
      setErrorMessage(null);
      onClose();
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

          {requiredNotice && (
            <View
              style={[
                styles.noticeBox,
                {
                  backgroundColor: theme.colors.accentTint,
                  borderColor: theme.colors.accent,
                },
              ]}
            >
              <AppText variant="caption" color={theme.colors.textPrimary}>
                {requiredNotice}
              </AppText>
            </View>
          )}

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
  cityItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
});
