import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface NaflTimingItem {
  titleKey: string;
  subtitle?: string;
  timeRange: string;
  type: 'nafl' | 'prohibited';
}

export interface NaflTimingsCardProps {
  tahajjudRange: string;
  lastThirdRange: string;
  ishraqRange: string;
  duhaRange: string;
  zawalRange: string;
}

export const NaflTimingsCard: React.FC<NaflTimingsCardProps> = ({
  tahajjudRange,
  lastThirdRange,
  ishraqRange,
  duhaRange,
  zawalRange,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const items: NaflTimingItem[] = [
    {
      titleKey: 'periodTahajjud',
      subtitle: `${t('lastThirdPill')}: ${lastThirdRange}`,
      timeRange: tahajjudRange,
      type: 'nafl',
    },
    {
      titleKey: 'periodIshraq',
      timeRange: ishraqRange,
      type: 'nafl',
    },
    {
      titleKey: 'periodDuha',
      timeRange: duhaRange,
      type: 'nafl',
    },
    {
      titleKey: 'periodZawal',
      subtitle: t('periodZawalSubtitle'),
      timeRange: zawalRange,
      type: 'prohibited',
    },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Toggle nafl and prohibited prayer times"
        style={styles.headerRow}
      >
        <View style={styles.titleWrap}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.headerTitle}>
            {t('naflAndProhibitedTimes')}
          </AppText>
          <View style={[styles.naflTag, { backgroundColor: theme.colors.secondaryTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.tagText}>
              {t('nafl')}
            </AppText>
          </View>
        </View>

        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
        >
          <Path
            d="M6 9l6 6 6-6"
            stroke={theme.colors.textMuted}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      {expanded && (
        <View style={styles.contentList}>
          {items.map((item, index) => {
            const isProhibited = item.type === 'prohibited';
            const badgeBg = isProhibited ? theme.colors.warningBg : theme.colors.secondaryTint;
            const badgeText = isProhibited ? theme.colors.warning : theme.colors.primary;

            return (
              <View
                key={item.titleKey}
                style={[
                  styles.itemRow,
                  index > 0 && { borderTopWidth: 1, borderTopColor: theme.colors.border },
                ]}
              >
                <View style={styles.itemInfo}>
                  <View style={styles.itemTitleRow}>
                    <AppText variant="bodyMedium" color={theme.colors.text} style={styles.itemTitle}>
                      {t(item.titleKey as any)}
                    </AppText>
                    <View style={[styles.typeBadge, { backgroundColor: badgeBg }]}>
                      <AppText variant="caption" color={badgeText} style={styles.badgeText}>
                        {isProhibited ? t('prohibited') : t('nafl')}
                      </AppText>
                    </View>
                  </View>
                  {item.subtitle && (
                    <AppText variant="caption" color={theme.colors.textMuted} style={styles.itemSubtitle}>
                      {item.subtitle}
                    </AppText>
                  )}
                </View>

                <AppText variant="bodySmall" color={theme.colors.text} style={styles.itemTime}>
                  {item.timeRange}
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
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md - 2,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  naflTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  contentList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  itemSubtitle: {
    fontSize: 11,
    lineHeight: 14,
  },
  itemTime: {
    fontWeight: '700',
    fontSize: 12,
  },
});

