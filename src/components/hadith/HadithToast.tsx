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
  const theme = useTheme('light');

  if (!message) return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.accent,
          },
        ]}
      >
        <View style={styles.contentRow}>
          {/* Checkmark icon */}
          <View style={styles.checkIconWrapper}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.2L5.5 11.7L6.91 10.29L10 13.37L17.09 6.28L18.5 7.7L10 16.2Z"
                fill={theme.colors.accent}
              />
            </Svg>
          </View>

          <AppText
            variant="bodySmall"
            color={theme.colors.white}
            style={styles.toastText}
          >
            {message}
          </AppText>
        </View>

        {/* Close Button */}
        <Pressable onPress={onDismiss} hitSlop={10} style={styles.closeBtn}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6L18 18"
              stroke={theme.colors.white}
              strokeWidth="2.5"
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
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
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
    marginLeft: SPACING.sm,
  },
});
