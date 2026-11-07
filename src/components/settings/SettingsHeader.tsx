import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface SettingsHeaderProps {
  onBack: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onBack }) => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={12} style={[styles.backBtn, { borderColor: theme.colors.border }]}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke={theme.colors.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <View style={styles.textColumn}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
          Settings
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Offline preferences • Stored on device
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
  },
});

