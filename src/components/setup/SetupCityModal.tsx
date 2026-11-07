import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import { PRESET_CITIES, PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

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
  const theme = useTheme('light');
  const [query, setQuery] = useState('');

  const filtered = PRESET_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <AppText variant="titleMedium" color={theme.colors.text}>
              Select City
            </AppText>
            <Pressable onPress={onClose} hitSlop={12}>
              <AppText variant="bodyMedium" color={theme.colors.textMuted}>
                Close
              </AppText>
            </Pressable>
          </View>

          <TextInput
            placeholder="Search city or country..."
            placeholderTextColor={theme.colors.textSubtle}
            value={query}
            onChangeText={setQuery}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surfaceElevated,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
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
                  {item.country}
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
    marginBottom: SPACING.md,
    fontSize: 14,
  },
  cityItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
});

