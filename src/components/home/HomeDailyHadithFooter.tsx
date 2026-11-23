import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { triggerHaptic } from '@/utils/haptics';

export interface HomeDailyHadithFooterProps {
  sourceText: string;
  onOpenWallpaper?: () => void;
  onShare: () => void;
}

export const HomeDailyHadithFooter: React.FC<HomeDailyHadithFooterProps> = ({
  sourceText,
  onOpenWallpaper,
  onShare,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSharePress = () => {
    triggerHaptic('light');
    onShare();
  };

  const handleWallpaperPress = () => {
    triggerHaptic('light');
    onOpenWallpaper?.();
  };

  return (
    <View style={[styles.footerRow, { borderTopColor: theme.colors.border }]}>
      <View style={styles.sourceWrapper}>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            stroke={theme.colors.accent}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke={theme.colors.accent}
            strokeWidth="2"
          />
        </Svg>
        <AppText
          variant="caption"
          color={theme.colors.textSecondary}
          style={styles.sourceText}
          numberOfLines={1}
        >
          {sourceText}
        </AppText>
      </View>

      <View style={styles.actionsRow}>
        {onOpenWallpaper && (
          <Pressable
            onPress={handleWallpaperPress}
            hitSlop={6}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
              },
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 },
            ]}
          >
            <AppText
              variant="caption"
              color={theme.colors.primary}
              style={styles.actionBtnText}
            >
              {t('wallpaper')}
            </AppText>
          </Pressable>
        )}
        <Pressable
          onPress={handleSharePress}
          hitSlop={6}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: theme.colors.secondaryTint,
              borderColor: theme.colors.primary,
            },
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 },
          ]}
        >
          <AppText
            variant="caption"
            color={theme.colors.primary}
            style={styles.actionBtnText}
          >
            {t('share')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  sourceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
});

