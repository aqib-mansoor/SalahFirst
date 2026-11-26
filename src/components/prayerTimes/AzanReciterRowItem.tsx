import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { AzanReciterKey } from '@/utils/azanAudio';

export interface ReciterItem {
  id: AzanReciterKey;
  labelKey: string;
  subtitleKey: string;
}

interface AzanReciterRowItemProps {
  item: ReciterItem;
  isSelected: boolean;
  isThisPlaying: boolean;
  isLoading: boolean;
  isLast: boolean;
  onSelect: (id: AzanReciterKey) => void;
  onTogglePlay: (id: AzanReciterKey) => void;
}

export const AzanReciterRowItem: React.FC<AzanReciterRowItemProps> = ({
  item,
  isSelected,
  isThisPlaying,
  isLoading,
  isLast,
  onSelect,
  onTogglePlay,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const playBg = isThisPlaying || isSelected
    ? theme.colors.primary
    : theme.isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : theme.colors.surfaceSubtle;

  const playBorder = isThisPlaying || isSelected
    ? 'rgba(255, 255, 255, 0.30)'
    : theme.isDark
    ? 'rgba(255, 255, 255, 0.22)'
    : theme.colors.border;

  const playIconColor = isThisPlaying || isSelected
    ? theme.colors.textOnPrimary
    : theme.isDark
    ? '#FFFFFF'
    : theme.colors.primary;

  return (
    <Pressable
      onPress={() => onSelect(item.id)}
      accessibilityRole="button"
      accessibilityLabel={t(item.labelKey as any)}
      style={({ pressed }) => [
        styles.rowItem,
        {
          backgroundColor: isSelected
            ? theme.isDark
              ? 'rgba(16, 185, 129, 0.16)'
              : theme.colors.secondaryTint
            : pressed
            ? theme.isDark
              ? 'rgba(255, 255, 255, 0.06)'
              : theme.colors.surfaceSubtle
            : 'transparent',
          borderBottomColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.radioCircle,
            {
              borderColor: isSelected
                ? theme.colors.primary
                : theme.isDark
                ? 'rgba(255, 255, 255, 0.35)'
                : theme.colors.border,
              backgroundColor: isSelected ? theme.colors.primary : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <View
              style={[
                styles.innerDot,
                { backgroundColor: theme.colors.textOnPrimary },
              ]}
            />
          )}
        </View>

        <View style={styles.textColumn}>
          <View style={styles.titleRow}>
            <AppText
              variant="bodyMedium"
              color={isSelected ? theme.colors.primary : theme.colors.text}
              style={[styles.titleText, isSelected && styles.selectedTitle]}
            >
              {t(item.labelKey as any)}
            </AppText>
            {isThisPlaying && (
              <View style={[styles.playingChip, { backgroundColor: theme.colors.primary }]}>
                <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.playingText}>
                  PLAYING
                </AppText>
              </View>
            )}
          </View>
          <AppText
            variant="caption"
            color={isSelected && theme.isDark ? 'rgba(255, 255, 255, 0.70)' : theme.colors.textMuted}
            numberOfLines={1}
          >
            {t(item.subtitleKey as any)}
          </AppText>
        </View>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          if (!isSelected) {
            onSelect(item.id);
          }
          onTogglePlay(item.id);
        }}
        disabled={isLoading}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={isThisPlaying ? 'Pause preview' : 'Play preview'}
        style={({ pressed }) => [
          styles.playButton,
          {
            backgroundColor: playBg,
            borderColor: playBorder,
          },
          pressed && { opacity: 0.82, transform: [{ scale: 0.94 }] },
        ]}
      >
        {isLoading && isSelected ? (
          <ActivityIndicator size="small" color={playIconColor} />
        ) : isThisPlaying ? (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" fill={playIconColor} />
          </Svg>
        ) : (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={styles.playIconOffset}>
            <Path d="M8 5v14l11-7z" fill={playIconColor} />
          </Svg>
        )}
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm + 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTitle: {
    fontWeight: '800',
  },
  playingChip: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: RADIUS.xs,
  },
  playingText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  playIconOffset: {
    marginLeft: 2,
  },
});
