import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface LegalHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => {
  const theme = useTheme();
  const { isRTL } = useTranslation();

  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.backBtn, { borderColor: theme.colors.border }]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d={isRTL ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}
            stroke={theme.colors.text}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      <View style={styles.headerTextCol}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
          {title}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
          {subtitle}
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontWeight: '500',
  },
});

