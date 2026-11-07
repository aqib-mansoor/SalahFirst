import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { AppText } from '@/components/common';

export interface WallpaperHeaderProps {
  themeName: string;
  onClose: () => void;
}

export const WallpaperHeader: React.FC<WallpaperHeaderProps> = ({
  themeName,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      {/* Theme Name Preview Pill */}
      <View style={styles.pillBadge}>
        <AppText variant="bodySmall" color="#FFFFFF" style={styles.pillText}>
          Preview: {themeName}
        </AppText>
      </View>

      {/* Close Button */}
      <Pressable
        onPress={onClose}
        hitSlop={12}
        style={({ pressed }) => [
          styles.closeButton,
          pressed && { opacity: 0.75 },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 6L6 18M6 6L18 18"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    zIndex: 20,
  },
  pillBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pillText: {
    fontWeight: '700',
    fontSize: 13,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
