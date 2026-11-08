import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { storage } from '@/utils/storage';
import { getLocalDateComponents } from '@/utils/timezone';

const SUNNAH_KEY = '@salahfirst_sunnah_history';

interface SunnahItem {
  id: string;
  name: string;
  description: string;
}

const SUNNAH_PRAYERS: SunnahItem[] = [
  { id: 'duha', name: 'Duha', description: 'Forenoon' },
  { id: 'witr', name: 'Witr', description: 'Night' },
  { id: 'tahajjud', name: 'Tahajjud', description: 'Qiyam' },
];

export const TrackerSunnahCard: React.FC = () => {
  const theme = useTheme();
  const todayKey = getLocalDateComponents(new Date()).dateKey;

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    storage.get<Record<string, Record<string, boolean>>>(SUNNAH_KEY, {}).then((history) => {
      if (history[todayKey]) {
        setCompletedMap(history[todayKey]);
      }
    });
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
            Sunnah & Voluntary Prayers
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
            Extra blessings beyond the 5 daily Fardh
          </AppText>
        </View>

        <View style={[styles.countBadge, { backgroundColor: theme.colors.surfaceElevated }]}>
          <AppText
            variant="caption"
            color={completedCount > 0 ? theme.colors.primary : theme.colors.textMuted}
            style={styles.countText}
          >
            {completedCount} / {SUNNAH_PRAYERS.length}
          </AppText>
        </View>
      </View>

      {/* 3 Sunnah Action Chips */}
      <View style={styles.chipsRow}>
        {SUNNAH_PRAYERS.map((item) => {
          const isDone = !!completedMap[item.id];

          return (
            <Pressable
              key={item.id}
              onPress={() => handleToggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isDone }}
              accessibilityLabel={`${item.name} voluntary prayer`}
              accessibilityHint={`Tap to toggle ${item.name}`}
              hitSlop={6}
              style={({ pressed }) => [
                styles.chip,
                isDone
                  ? {
                      backgroundColor: theme.colors.mintTint,
                      borderColor: theme.colors.border,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                    },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={styles.chipHeader}>
                <AppText
                  variant="caption"
                  color={isDone ? theme.colors.primary : theme.colors.text}
                  style={styles.chipTitle}
                >
                  {item.name}
                </AppText>
                {isDone ? (
                  <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
                    <Svg width={9} height={9} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M20 6L9 17L4 12"
                        stroke={theme.colors.textInverse}
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
                {item.description}
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
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    gap: SPACING.sm,
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
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 10.5,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: RADIUS.full,
  },
  countText: {
    fontWeight: '800',
    fontSize: 10.5,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1.2,
    gap: 2,
  },
  chipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipTitle: {
    fontWeight: '700',
    fontSize: 11.5,
  },
  chipSub: {
    fontSize: 9.5,
    fontWeight: '500',
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
});

