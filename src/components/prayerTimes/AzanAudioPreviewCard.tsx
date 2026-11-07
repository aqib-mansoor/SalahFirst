import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface AzanAudioPreviewCardProps {
  isLoading: boolean;
  isPlaying: boolean;
  onToggle: () => void;
}

export const AzanAudioPreviewCard: React.FC<AzanAudioPreviewCardProps> = ({
  isLoading,
  isPlaying,
  onToggle,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.audioInfo}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
          {t('makkahAzanPreview')}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {isLoading
            ? 'Connecting to audio stream...'
            : isPlaying
            ? 'Playing Makkah Haram Azan • Hayya alas-Salah'
            : t('tapToPreviewAzan')}
        </AppText>
      </View>
      <Pressable
        onPress={onToggle}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? t('stopAzanPreview') : t('playAzanPreview')}
        style={[styles.audioBtn, { backgroundColor: theme.colors.buttonGold }]}
      >
        <AppText variant="caption" color={theme.colors.buttonGoldText} style={styles.audioBtnText}>
          {isLoading ? '⏳ ...' : isPlaying ? `⏹ ${t('stopAzanPreview')}` : `▶ ${t('playAzanPreview')}`}
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  audioInfo: {
    flex: 1,
    gap: 2,
  },
  boldText: {
    fontWeight: '700',
  },
  audioBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  audioBtnText: {
    fontWeight: '700',
  },
});
