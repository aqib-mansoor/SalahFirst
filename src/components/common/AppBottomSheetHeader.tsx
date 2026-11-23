import React, { ReactNode } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { SPACING, RADIUS } from '@/constants/theme';

export interface AppBottomSheetHeaderProps {
  title: string;
  badgeText?: string;
  subtitleText?: string;
  icon?: ReactNode;
  showCloseButton?: boolean;
  disableDismiss?: boolean;
  onClose?: () => void;
}

export const AppBottomSheetHeader: React.FC<AppBottomSheetHeaderProps> = ({
  title,
  badgeText,
  subtitleText,
  icon,
  showCloseButton = true,
  disableDismiss = false,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      {icon && (
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: theme.isDark ? 'rgba(16, 185, 129, 0.14)' : theme.colors.mintTint,
              borderColor: theme.isDark ? theme.colors.primaryDark : theme.colors.border,
            },
          ]}
        >
          {icon}
        </View>
      )}

      <View style={styles.headerText}>
        <AppText
          variant="titleMedium"
          color={theme.colors.textPrimary}
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </AppText>

        {(badgeText || subtitleText) && (
          <View style={styles.subRow}>
            {badgeText && (
              <View
                style={[
                  styles.badgePill,
                  {
                    backgroundColor: theme.isDark ? theme.colors.surfaceSubtle : theme.colors.mintTint,
                    borderColor: theme.isDark ? theme.colors.border : theme.colors.primary,
                  },
                ]}
              >
                <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
                  {badgeText}
                </AppText>
              </View>
            )}
            {subtitleText && (
              <AppText
                variant="caption"
                color={theme.colors.textSecondary}
                numberOfLines={1}
                style={styles.subtitleText}
              >
                {badgeText ? `• ${subtitleText}` : subtitleText}
              </AppText>
            )}
          </View>
        )}
      </View>

      {showCloseButton && !disableDismiss && onClose && (
        <Pressable
          onPress={onClose}
          hitSlop={12}
          style={({ pressed }) => [
            styles.closeBtn,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderColor: theme.colors.border,
            },
            pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6l12 12"
              stroke={theme.colors.textSecondary}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    width: '100%',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  headerText: { flex: 1, gap: 3 },
  title: { fontWeight: '800', fontSize: 17, letterSpacing: -0.2 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 },
  badgePill: {
    paddingHorizontal: SPACING.xs + 4,
    paddingVertical: 1.5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: { fontWeight: '800', fontSize: 10, letterSpacing: 0.2 },
  subtitleText: { flexShrink: 1 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

