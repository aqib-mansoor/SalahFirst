import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface HadithToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const HadithToast: React.FC<HadithToastProps> = ({ message, onDismiss }) => {
  const theme = useTheme();

  if (!message) return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.contentRow}>
          {/* Subtle Mint Icon Box */}
          <View
            style={[
              styles.checkIconWrapper,
              { backgroundColor: theme.colors.secondaryTint },
            ]}
          >
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 6L9 17L4 12"
                stroke={theme.colors.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <AppText
            variant="bodySmall"
            color={theme.colors.text}
            style={styles.toastText}
          >
            {message}
          </AppText>
        </View>

        {/* Close Button */}
        <Pressable
          onPress={onDismiss}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          style={styles.closeBtn}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6L18 18"
              stroke={theme.colors.textMuted}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 3,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  checkIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    fontWeight: '600',
    flex: 1,
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
});
