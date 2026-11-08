import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { useTranslation } from '@/context/LocalizationContext';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  backAccessibilityLabel?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  backAccessibilityLabel = 'Go back',
}) => {
  const theme = useTheme();
  const { isRTL } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={backAccessibilityLabel}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
                borderColor: theme.colors.border,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d={isRTL ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}
                stroke={theme.colors.text}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        )}

        <View style={styles.titleColumn}>
          <AppText
            variant="titleMedium"
            color={theme.colors.text}
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </AppText>
          {subtitle && (
            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              style={styles.subtitle}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          )}
        </View>
      </View>

      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleColumn: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginLeft: SPACING.sm,
  },
});
