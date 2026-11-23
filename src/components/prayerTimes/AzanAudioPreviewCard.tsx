import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { AzanReciterKey } from '@/utils/azanAudio';
import { AzanPreviewError } from '@/hooks/useAzanAudio';
import { triggerHaptic } from '@/utils/haptics';

export interface AzanAudioPreviewCardProps {
  isLoading: boolean;
  isPlaying: boolean;
  currentReciter: AzanReciterKey;
  error?: AzanPreviewError | null;
  onOpenReciterSheet: () => void;
  onToggle: () => void;
}

const RECITERS_MAP: Record<AzanReciterKey, { labelKey: string; subKey: string }> = {
  makkah: { labelKey: 'reciterMakkah', subKey: 'reciterMakkahSub' },
  madinah: { labelKey: 'reciterMadinah', subKey: 'reciterMadinahSub' },
  alAqsa: { labelKey: 'reciterAlAqsa', subKey: 'reciterAlAqsaSub' },
  alafasy: { labelKey: 'reciterAlafasy', subKey: 'reciterAlafasySub' },
  egypt: { labelKey: 'reciterEgypt', subKey: 'reciterEgyptSub' },
  zahrani: { labelKey: 'reciterZahrani', subKey: 'reciterZahraniSub' },
};

export const AzanAudioPreviewCard: React.FC<AzanAudioPreviewCardProps> = ({
  isLoading,
  isPlaying,
  currentReciter,
  error,
  onOpenReciterSheet,
  onToggle,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const activeReciter = RECITERS_MAP[currentReciter] || RECITERS_MAP.makkah;
  const activeLabel = t(activeReciter.labelKey as any);
  const activeSubtitle = t(activeReciter.subKey as any);

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
      <View style={styles.topRow}>
        <View style={styles.titleColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.titleText}>
            {t('azanVoiceSelection')}
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

      <Pressable
        onPress={() => {
          triggerHaptic();
          onOpenReciterSheet();
        }}
        accessibilityRole="button"
        accessibilityLabel={t('changeAzanVoice')}
        style={({ pressed }) => [
          styles.selectorRow,
          {
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surfaceSubtle,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.voiceInfo}>
          <View style={[styles.voiceIconWrap, { backgroundColor: theme.colors.secondaryTint }]}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={styles.voiceTextWrap}>
            <AppText variant="bodyMedium" color={theme.colors.text} style={styles.voiceName}>
              {activeLabel}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>
              {activeSubtitle}
            </AppText>
          </View>
        </View>

        <View style={[styles.changeBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.changeBadgeText}>
            {t('changeAzanVoice')}
          </AppText>
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18l6-6-6-6"
              stroke={theme.colors.primary}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </Pressable>
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
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  voiceIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceTextWrap: {
    flex: 1,
    gap: 1,
  },
  voiceName: {
    fontWeight: '600',
    fontSize: 13,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 4,
  },
  changeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
