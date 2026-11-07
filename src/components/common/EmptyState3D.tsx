import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';

export interface EmptyState3DProps {
  title: string;
  description: string;
}

export const EmptyState3D: React.FC<EmptyState3DProps> = ({
  title,
  description,
}) => {
  const theme = useTheme('light');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* 3D Isometric Book & Bookmark Chest Emblem */}
      <View style={styles.svgWrapper}>
        <Svg width={96} height={96} viewBox="0 0 96 96">
          <Defs>
            <LinearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#E8CA94" />
              <Stop offset="50%" stopColor="#CCA15F" />
              <Stop offset="100%" stopColor="#967035" />
            </LinearGradient>
            <LinearGradient id="chestWood" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#1E3A2F" />
              <Stop offset="100%" stopColor="#0D241C" />
            </LinearGradient>
          </Defs>

          {/* Ambient Ground Shadow */}
          <Circle cx="48" cy="74" r="30" fill="rgba(0,0,0,0.06)" />

          {/* Chest Base (Isometric Cube) */}
          <Path
            d="M 24 50 L 48 38 L 72 50 L 48 62 Z"
            fill="url(#chestGold)"
          />
          <Path
            d="M 24 50 L 48 62 L 48 76 L 24 64 Z"
            fill="url(#chestWood)"
          />
          <Path
            d="M 72 50 L 48 62 L 48 76 L 72 64 Z"
            fill="#112B21"
          />

          {/* Golden Ribbon Bookmark Flowing Out */}
          <Path
            d="M 44 32 C 44 24, 52 24, 52 38 L 52 56 L 48 53 L 44 56 Z"
            fill="url(#chestGold)"
          />

          {/* Metallic Clasp & Lock */}
          <Rect x="45" y="58" width="6" height="8" rx="1.5" fill="#FFE2B0" />
          <Circle cx="48" cy="61" r="1.2" fill="#523912" />

          {/* Floating Islamic Geometry Sparks */}
          <Circle cx="26" cy="30" r="2" fill="#CCA15F" opacity={0.6} />
          <Circle cx="70" cy="34" r="2.5" fill="#CCA15F" opacity={0.6} />
        </Svg>
      </View>

      <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
        {title}
      </AppText>
      <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.description}>
        {description}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.xxl,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: SPACING.xs + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  svgWrapper: {
    marginBottom: SPACING.xs,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

