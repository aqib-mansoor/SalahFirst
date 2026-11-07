import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface LocationActionButtonsProps {
  isLoading: boolean;
  permissionDenied: boolean;
  onRequestGps: () => void;
  onOpenSettings: () => void;
  onSelectCityManually?: () => void;
}

export const LocationActionButtons: React.FC<LocationActionButtonsProps> = ({
  isLoading,
  permissionDenied,
  onRequestGps,
  onOpenSettings,
  onSelectCityManually,
}) => {
  const theme = useTheme();

  if (permissionDenied) {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={onOpenSettings}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: pressed ? theme.colors.buttonGoldPressed : theme.colors.buttonGold,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <AppText variant="titleSmall" color={theme.colors.buttonGoldText} style={styles.buttonText}>
            Enable Location in Settings
          </AppText>
        </Pressable>

        {onSelectCityManually && (
          <Pressable
            onPress={onSelectCityManually}
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryBtn,
              {
                backgroundColor: pressed ? theme.colors.mintTintPressed : theme.colors.mintTint,
                borderColor: theme.colors.primary,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <AppText variant="titleSmall" color={theme.colors.primary} style={styles.buttonText}>
              Select City Manually
            </AppText>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onRequestGps}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor: pressed ? theme.colors.mintTintPressed : theme.colors.mintTint,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L19 21L12 17L5 21L12 2Z"
              stroke={theme.colors.primary}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
        <AppText variant="titleSmall" color={theme.colors.primary} style={styles.buttonText}>
          {isLoading ? 'Detecting Precise GPS...' : 'Refresh GPS Location'}
        </AppText>
      </Pressable>

      {onSelectCityManually && (
        <Pressable onPress={onSelectCityManually} hitSlop={10} style={styles.manualLinkPressable}>
          <AppText variant="bodySmall" color={theme.colors.primary} style={styles.manualLinkText}>
            Or select your city manually ›
          </AppText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: SPACING.sm,
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  secondaryBtn: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  manualLinkPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  manualLinkText: {
    fontWeight: '600',
  },
});
