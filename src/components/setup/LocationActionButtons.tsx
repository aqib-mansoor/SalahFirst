import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
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
          {
            backgroundColor: pressed ? theme.colors.mintTintPressed : theme.colors.mintTint,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L19 21L12 17L5 21L12 2Z"
            stroke={theme.colors.primary}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
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
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={theme.colors.text} strokeWidth="1.8" />
          <Path
            d="M3.6 9H20.4M3.6 15H20.4M12 3C14.2 5.6 15.5 8.7 15.5 12C15.5 15.3 14.2 18.4 12 21C9.8 18.4 8.5 15.3 8.5 12C8.5 8.7 9.8 5.6 12 3Z"
            stroke={theme.colors.text}
            strokeWidth="1.8"
          />
        </Svg>
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
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
  },
  outlineButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
