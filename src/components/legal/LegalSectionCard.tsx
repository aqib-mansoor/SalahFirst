import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface LegalSectionCardProps {
  title: string;
  body: string;
  highlight?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export const LegalSectionCard: React.FC<LegalSectionCardProps> = ({
  title,
  body,
  highlight = false,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();
  const { isRTL } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: highlight ? theme.colors.surfaceElevated : theme.colors.surface,
          borderColor: highlight ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <AppText
        variant="titleSmall"
        color={highlight ? theme.colors.primary : theme.colors.text}
        align={isRTL ? 'right' : 'left'}
        style={styles.title}
      >
        {title}
      </AppText>
      <AppText
        variant="bodySmall"
        color={theme.colors.textMuted}
        align={isRTL ? 'right' : 'left'}
        style={styles.body}
      >
        {body}
      </AppText>

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          accessibilityRole="link"
          accessibilityLabel={actionLabel}
          style={[
            styles.linkBtn,
            { backgroundColor: theme.colors.mintTint, borderColor: theme.colors.primary },
            isRTL && styles.linkBtnRTL,
          ]}
        >
          <AppText
            variant="caption"
            color={theme.colors.primary}
            style={styles.linkText}
          >
            {actionLabel} ↗
          </AppText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.xs + 2,
  },
  title: {
    fontWeight: '700',
    lineHeight: 20,
  },
  body: {
    lineHeight: 20,
  },
  linkBtn: {
    marginTop: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  linkBtnRTL: {
    alignSelf: 'flex-end',
  },
  linkText: {
    fontWeight: '700',
  },
});
