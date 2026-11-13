import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { DayOverview } from '@/utils/trackerStatistics';

export interface StreaksHeroCardProps {
  streakDays: number;
  weekData?: DayOverview[];
}

export const StreaksHeroCard: React.FC<StreaksHeroCardProps> = ({ streakDays, weekData = [] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const spiritualQuote =
    streakDays === 0
      ? t('beginYourStreak') || 'Begin your sacred prayer streak today.'
      : streakDays < 7
      ? '“The most beloved deed to Allah is that which is done consistently.”'
      : streakDays < 30
      ? '“Take up deeds you can carry out steadfastly.”'
      : '“Istiqamah: Steadfastness is greater than a thousand miracles.”';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.primaryHero,
          borderColor: 'rgba(255, 255, 255, 0.14)',
        },
      ]}
    >
      <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.14} />

      <View style={styles.topRow}>
        <View style={styles.contentCol}>
          <AppText variant="caption" color={theme.colors.accentLight} style={styles.label}>
            {t('currentStreak').toUpperCase()}
          </AppText>
          <AppText variant="titleMedium" color={theme.colors.textOnPrimary} style={styles.streakNumber}>
            {streakDays}{' '}
            <AppText variant="bodySmall" color={theme.colors.textOnPrimary} style={styles.unitText}>
              {t('daysFiveOfFive')}
            </AppText>
          </AppText>
          <AppText variant="caption" color={theme.colors.accentLight} style={styles.subtext}>
            {spiritualQuote}
          </AppText>
        </View>

        {/* Multi-layered 3D Fire Orb Badge */}
        <View
          style={[
            styles.flameOuterRing,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.18)',
            },
          ]}
        >
          <View
            style={[
              styles.flameInnerOrb,
              {
                backgroundColor: theme.colors.accentTint,
                borderColor: theme.colors.accent,
              },
            ]}
          >
            <AppText style={styles.flameEmoji}>🔥</AppText>
          </View>
        </View>
      </View>

      {/* 7-Day Mini Flame / Check Strip */}
      {weekData.length > 0 && (
        <View style={styles.weekStrip}>
          {weekData.map((day, idx) => {
            const isFull = day.completed === 5;
            const isPartial = day.completed > 0 && day.completed < 5;
            return (
              <View key={day.dateKey || idx} style={styles.dayMiniCol}>
                <View
                  style={[
                    styles.dayMiniCircle,
                    isFull
                      ? {
                          backgroundColor: theme.colors.accentTint,
                          borderColor: theme.colors.accent,
                        }
                      : isPartial
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.14)',
                          borderColor: 'rgba(255, 255, 255, 0.35)',
                        }
                      : {
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          borderColor: 'rgba(255, 255, 255, 0.14)',
                        },
                    day.isToday && { borderColor: theme.colors.accentLight, borderWidth: 1.5 },
                  ]}
                >
                  {isFull ? (
                    <AppText style={styles.miniFlameEmoji}>🔥</AppText>
                  ) : isPartial ? (
                    <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.miniCountText}>
                      {day.completed}
                    </AppText>
                  ) : (
                    <View style={styles.emptyDot} />
                  )}
                </View>
                <AppText
                  variant="caption"
                  color={day.isToday ? theme.colors.accentLight : theme.colors.textOnPrimary}
                  style={[styles.dayMiniLabel, !day.isToday && { opacity: 0.72 }]}
                >
                  {day.dayLabel}
                </AppText>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.md + 4,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    gap: SPACING.md,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  contentCol: {
    flex: 1,
    gap: 2,
    marginRight: SPACING.sm,
  },
  label: {
    fontWeight: '800',
    fontSize: 10.5,
    letterSpacing: 0.8,
  },
  streakNumber: {
    fontWeight: '900',
    fontSize: 24,
    lineHeight: 29,
  },
  unitText: {
    fontWeight: '600',
    fontSize: 12.5,
  },
  subtext: {
    lineHeight: 15,
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
    opacity: 0.95,
  },
  flameOuterRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameInnerOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameEmoji: {
    fontSize: 22,
    lineHeight: 27,
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
    zIndex: 2,
  },
  dayMiniCol: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  dayMiniCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniFlameEmoji: {
    fontSize: 13,
    lineHeight: 16,
  },
  miniCountText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  emptyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dayMiniLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
});
