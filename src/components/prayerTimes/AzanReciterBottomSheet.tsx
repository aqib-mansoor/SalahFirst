import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { AzanReciterKey } from '@/utils/azanAudio';
import { triggerHaptic } from '@/utils/haptics';

export interface AzanReciterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  currentReciter: AzanReciterKey;
  isPlaying: boolean;
  isLoading: boolean;
  onSelectReciter: (key: AzanReciterKey) => void;
  onTogglePlay: (key?: AzanReciterKey) => void;
}

interface ReciterItem {
  id: AzanReciterKey;
  labelKey: string;
  subtitleKey: string;
}

const RECITERS: ReciterItem[] = [
  { id: 'makkah', labelKey: 'reciterMakkah', subtitleKey: 'reciterMakkahSub' },
  { id: 'madinah', labelKey: 'reciterMadinah', subtitleKey: 'reciterMadinahSub' },
  { id: 'alAqsa', labelKey: 'reciterAlAqsa', subtitleKey: 'reciterAlAqsaSub' },
  { id: 'alafasy', labelKey: 'reciterAlafasy', subtitleKey: 'reciterAlafasySub' },
  { id: 'egypt', labelKey: 'reciterEgypt', subtitleKey: 'reciterEgyptSub' },
  { id: 'zahrani', labelKey: 'reciterZahrani', subtitleKey: 'reciterZahraniSub' },
];

export const AzanReciterBottomSheet: React.FC<AzanReciterBottomSheetProps> = ({
  visible,
  onClose,
  currentReciter,
  isPlaying,
  isLoading,
  onSelectReciter,
  onTogglePlay,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSelect = (key: AzanReciterKey) => {
    triggerHaptic();
    onSelectReciter(key);
  };

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
        stroke={theme.colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
        stroke={theme.colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('chooseAzanVoice')}
      subtitleText={t('chooseAzanVoiceSubtitle')}
      badgeText={t('sixVoicesBadge')}
      icon={headerIcon}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        <View
          style={[
            styles.listContainer,
            {
              backgroundColor: theme.isDark ? theme.colors.surfaceSubtle : theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {RECITERS.map((item, index) => {
            const isSelected = currentReciter === item.id;
            const isThisPlaying = isPlaying && isSelected;
            const isLast = index === RECITERS.length - 1;

            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelect(item.id)}
                accessibilityRole="button"
                accessibilityLabel={t(item.labelKey as any)}
                style={({ pressed }) => [
                  styles.rowItem,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.secondaryTint
                      : pressed
                      ? theme.colors.surfaceElevated
                      : 'transparent',
                    borderBottomColor: theme.colors.border,
                    borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <View style={styles.leftSection}>
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
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
                    <AppText
                      variant="bodyMedium"
                      color={isSelected ? theme.colors.primary : theme.colors.text}
                      style={[styles.titleText, isSelected && styles.selectedTitle]}
                    >
                      {t(item.labelKey as any)}
                    </AppText>
                    <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>
                      {t(item.subtitleKey as any)}
                    </AppText>
                  </View>
                </View>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      handleSelect(item.id);
                    }
                    onTogglePlay(item.id);
                  }}
                  disabled={isLoading}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={isThisPlaying ? 'Stop preview' : 'Play preview'}
                  style={({ pressed }) => [
                    styles.playButton,
                    {
                      backgroundColor: isThisPlaying
                        ? theme.colors.error
                        : isSelected
                        ? theme.colors.primary
                        : theme.colors.surfaceSubtle,
                      opacity: isLoading ? 0.6 : pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  {isThisPlaying ? (
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path d="M6 6h12v12H6z" fill={theme.colors.textOnPrimary} />
                    </Svg>
                  ) : (
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={styles.playIconOffset}>
                      <Path
                        d="M8 5v14l11-7z"
                        fill={isSelected ? theme.colors.textOnPrimary : theme.colors.text}
                      />
                    </Svg>
                  )}
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollList: {
    paddingBottom: SPACING.md,
  },
  listContainer: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
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
  titleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTitle: {
    fontWeight: '700',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOffset: {
    marginLeft: 2,
  },
});
