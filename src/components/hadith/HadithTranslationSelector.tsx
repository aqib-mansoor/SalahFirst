import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithTranslationMode } from '@/hooks/useHadithCollection';

export interface HadithTranslationSelectorProps {
  translationMode: HadithTranslationMode;
  onSelectTranslationMode: (mode: HadithTranslationMode) => void;
}

const TRANSLATION_OPTIONS: { id: HadithTranslationMode; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ur', label: 'اردو' },
  { id: 'both', label: 'Both' },
];

export const HadithTranslationSelector: React.FC<HadithTranslationSelectorProps> = ({
  translationMode,
  onSelectTranslationMode,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.translationTrack,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {TRANSLATION_OPTIONS.map((opt) => {
        const active = translationMode === opt.id;
        const displayLabel = opt.id === 'both' ? (t('translationBoth') || 'Both') : opt.label;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelectTranslationMode(opt.id)}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${displayLabel} translation`}
            style={[
              styles.segment,
              active && [
                styles.activeSegment,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.primary,
                },
              ],
            ]}
          >
            <AppText
              variant="caption"
              color={active ? theme.colors.primary : theme.colors.textMuted}
              style={[styles.segmentLabel, active && styles.activeSegmentLabel]}
            >
              {displayLabel}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  translationTrack: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    borderWidth: 1.5,
  },
  segmentLabel: {
    fontWeight: '600',
    fontSize: 11,
  },
  activeSegmentLabel: {
    fontWeight: '700',
  },
});

