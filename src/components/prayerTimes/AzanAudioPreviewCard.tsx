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
      {/* Title & Play Button Header */}
      <View style={styles.topRow}>
        <View style={styles.titleInfo}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
            {t('makkahAzanPreview')}
          </AppText>
          <View style={styles.statusRow}>
            {isLoading && (
              <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 4 }} />
            )}
            <AppText
              variant="caption"
              color={error ? theme.colors.error : isPlaying ? theme.colors.primary : theme.colors.textMuted}
              numberOfLines={2}
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
            styles.playBtn,
            {
              backgroundColor: theme.colors.buttonGold,
              opacity: isLoading ? 0.7 : pressed ? 0.9 : 1,
            },
          ]}
        >
          {isPlaying ? (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M6 6h12v12H6z" fill={theme.colors.buttonGoldText} />
            </Svg>
          ) : (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M8 5v14l11-7z" fill={theme.colors.buttonGoldText} />
            </Svg>
          )}
          <AppText variant="caption" color={theme.colors.buttonGoldText} style={styles.btnText}>
            {isPlaying ? t('stopAzanPreview') : t('playAzanPreview')}
          </AppText>
        </Pressable>
      </View>

      {/* Reciter Selector Pills */}
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
                styles.reciterPill,
                {
                  backgroundColor: isSelected
                    ? theme.colors.secondaryTint
                    : pressed
                    ? theme.colors.surfaceElevated
                    : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  borderWidth: isSelected ? 1.5 : 1,
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  titleInfo: {
    flex: 1,
    gap: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    flexShrink: 1,
    fontSize: 11,
  },
  boldText: {
    fontWeight: '700',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.lg,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 12,
  },
  recitersRow: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
  },
  reciterPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
  },
  reciterText: {
    fontSize: 11,
  },
});
