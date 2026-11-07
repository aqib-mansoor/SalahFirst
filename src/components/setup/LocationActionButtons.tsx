import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface LocationActionButtonsProps {
  isLoading: boolean;
  onRequestGps: () => void;
  onOpenCityModal: () => void;
}

export const LocationActionButtons: React.FC<LocationActionButtonsProps> = ({
  isLoading,
  onRequestGps,
  onOpenCityModal,
}) => {
  const theme = useTheme('light');

  return (
    <View style={styles.buttonsRow}>
      <Pressable
        onPress={onRequestGps}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: pressed ? theme.colors.mintTintPressed : theme.colors.mintTint },
        ]}
      >
        <AppText variant="titleSmall" color={theme.colors.primary} style={styles.buttonText}>
          Use Device GPS
        </AppText>
      </Pressable>

      <Pressable
        onPress={onOpenCityModal}
        style={({ pressed }) => [
          styles.actionButton,
          styles.outlineButton,
          {
            borderColor: theme.colors.border,
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
          },
        ]}
      >
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.buttonText}>
          Select City List
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

