import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, PrayerTimeIcon } from '@/components/common';
import { storage } from '@/utils/storage';
import { getLocalDateComponents } from '@/utils/timezone';
import { APP_CONFIG } from '@/constants/config';
import { useTranslation, TranslationKey } from '@/context/LocalizationContext';
import { addTrackerListener } from '@/hooks/usePrayerTracker';

const SUNNAH_KEY = APP_CONFIG.storageKeys.sunnahHistory;

interface SunnahItem {
  id: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  iconPrayer: string;
}

const SUNNAH_PRAYERS: SunnahItem[] = [
  { id: 'duha', nameKey: 'sunnahDuha', descKey: 'sunnahDuhaDesc', iconPrayer: 'Dhuhr' },
  { id: 'witr', nameKey: 'sunnahWitr', descKey: 'sunnahWitrDesc', iconPrayer: 'Isha' },
  { id: 'tahajjud', nameKey: 'sunnahTahajjud', descKey: 'sunnahTahajjudDesc', iconPrayer: 'Fajr' },
];

export const TrackerSunnahCard: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const todayKey = getLocalDateComponents(new Date()).dateKey;

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadTodaySunnah = () => {
      storage.get<Record<string, Record<string, boolean>>>(SUNNAH_KEY, {}).then((history) => {
        setCompletedMap(history[todayKey] || {});
      });
    };
    loadTodaySunnah();
    return addTrackerListener(loadTodaySunnah);
  }, [todayKey]);

  const handleToggle = useCallback(
    async (id: string) => {
      const nextMap = { ...completedMap, [id]: !completedMap[id] };
      setCompletedMap(nextMap);

      const history = await storage.get<Record<string, Record<string, boolean>>>(SUNNAH_KEY, {});
      history[todayKey] = nextMap;
      await storage.set(SUNNAH_KEY, history);
    },
    [completedMap, todayKey]
  );

  const completedCount = Object.values(completedMap).filter(Boolean).length;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
            {t('sunnahAndVoluntaryTitle')}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
            {t('sunnahAndVoluntarySub')}
          </AppText>
        </View>

        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: completedCount === SUNNAH_PRAYERS.length ? theme.colors.primary : theme.colors.secondaryTint,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <AppText
            variant="caption"
            color={completedCount === SUNNAH_PRAYERS.length ? theme.colors.textOnPrimary : theme.colors.primary}
            style={styles.countText}
          >
            {completedCount}/{SUNNAH_PRAYERS.length}
          </AppText>
        </View>
      </View>

      {/* 3 Sunnah Action Chips */}
      <View style={styles.chipsRow}>
        {SUNNAH_PRAYERS.map((item) => {
          const isDone = !!completedMap[item.id];
          const itemName = t(item.nameKey);
          const itemDesc = t(item.descKey);

          return (
            <Pressable
              key={item.id}
              onPress={() => handleToggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isDone }}
              accessibilityLabel={`${itemName} voluntary prayer`}
              accessibilityHint={`Tap to toggle ${itemName}`}
              hitSlop={6}
              style={({ pressed }) => [
                styles.chip,
                isDone
                  ? {
                      backgroundColor: theme.colors.secondaryTint,
                      borderColor: theme.colors.primary,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                    },
                pressed && { transform: [{ scale: 0.97 }], opacity: 0.85 },
              ]}
            >
              <View style={styles.chipHeader}>
                <View style={styles.nameWithIcon}>
                  <PrayerTimeIcon prayer={item.iconPrayer} size={14} />
                  <AppText
                    variant="caption"
                    color={isDone ? theme.colors.primary : theme.colors.text}
                    style={styles.chipTitle}
                  >
                    {itemName}
                  </AppText>
                </View>
                {isDone ? (
                  <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
                    <Svg width={9} height={9} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M20 6L9 17L4 12"
                        stroke={theme.colors.textOnPrimary}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                ) : (
                  <View style={[styles.emptyCircle, { borderColor: theme.colors.border }]} />
                )}
              </View>

              <AppText variant="caption" color={theme.colors.textMuted} style={styles.chipSub}>
                {itemDesc}
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
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    gap: SPACING.sm + 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    gap: 1,
    flex: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 13.5,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 11,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  countText: {
    fontWeight: '800',
    fontSize: 10.5,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 9,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    gap: 4,
  },
  chipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chipTitle: {
    fontWeight: '800',
    fontSize: 12,
  },
  chipSub: {
    fontSize: 10,
    fontWeight: '600',
  },
  checkCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1.2,
  },
});
