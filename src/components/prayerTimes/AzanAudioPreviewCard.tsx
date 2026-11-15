import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { AzanReciterKey } from '@/utils/azanAudio';
import { AzanPreviewError } from '@/hooks/useAzanAudio';

export interface AzanAudioPreviewCardProps {
  isLoading: boolean;
  isPlaying: boolean;
  currentReciter: AzanReciterKey;
  error?: AzanPreviewError | null;
  onSelectReciter: (key: AzanReciterKey) => void;
  onToggle: () => void;
}

const RECITERS: { id: AzanReciterKey; labelKey: string }[] = [
  { id: 'makkah', labelKey: 'reciterMakkah' },
  { id: 'madinah', labelKey: 'reciterMadinah' },
  { id: 'alAqsa', labelKey: 'reciterAlAqsa' },
];

export const AzanAudioPreviewCard: React.FC<AzanAudioPreviewCardProps> = ({
  isLoading,
  isPlaying,
  currentReciter,
  error,
  onSelectReciter,
  onToggle,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const activeReciterObj = RECITERS.find((r) => r.id === currentReciter) || RECITERS[0];
  const activeLabel = t(activeReciterObj.labelKey as any);

  let statusText = t('tapToPreviewAzan');
  if (isLoading) {
    statusText = t('connectingToStream');
  } else if (isPlaying) {
    statusText = t('playingAzan', { reciter: activeLabel });
  } else if (error) {
    statusText = t(error === 'muted' ? 'previewMutedBySoundMode' : 'audioStreamError');
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.titleText}>
            {t('makkahAzanPreview')}
          </AppText>
          <View style={styles.statusRow}>
            {isLoading && (
              <ActivityIndicator size="small" color={theme.colors.primary} style={styles.indicator} />
            )}
            <AppText
              variant="caption"
              color={error ? theme.colors.error : isPlaying ? theme.colors.primary : theme.colors.textMuted}
              numberOfLines={1}
              style={styles.statusText}
            >
              {statusText}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={onToggle}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? t('stopAzanPreview') : t('playAzanPreview')}
          style={({ pressed }) => [
            styles.playCircle,
            {
              backgroundColor: isPlaying ? theme.colors.error : theme.colors.primary,
              opacity: isLoading ? 0.7 : pressed ? 0.85 : 1,
            },
          ]}
        >
          {isPlaying ? (
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M6 6h12v12H6z" fill={theme.colors.textOnPrimary} />
            </Svg>
          ) : (
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.playIconOffset}>
              <Path d="M8 5v14l11-7z" fill={theme.colors.textOnPrimary} />
            </Svg>
          )}
        </Pressable>
      </View>

      <View style={styles.recitersRow}>
        {RECITERS.map((reciter) => {
          const isSelected = currentReciter === reciter.id;
          return (
            <Pressable
              key={reciter.id}
              onPress={() => onSelectReciter(reciter.id)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.reciterChip,
                {
                  backgroundColor: isSelected
                    ? theme.colors.secondaryTint
                    : pressed
                    ? theme.colors.surfaceElevated
                    : theme.colors.surfaceSubtle,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={isSelected ? theme.colors.primary : theme.colors.text}
                style={[styles.reciterText, { fontWeight: isSelected ? '700' : '500' }]}
              >
                {t(reciter.labelKey as any)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  titleColumn: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontWeight: '700',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    marginRight: 4,
  },
  statusText: {
    flexShrink: 1,
    fontSize: 11,
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOffset: {
    marginLeft: 2,
  },
  recitersRow: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
  },
  reciterChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  reciterText: {
    fontSize: 11,
  },
});
