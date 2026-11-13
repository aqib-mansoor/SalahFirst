import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, PrayerTimeIcon } from '@/components/common';
import { PrayerStatus } from '@/hooks/usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';

export interface TrackerPrayerRowProps {
  prayer: PrayerStatus;
  onPressStatus?: () => void;
}

export const TrackerPrayerRow: React.FC<TrackerPrayerRowProps> = ({
  prayer,
  onPressStatus,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPressStatus}
      accessibilityRole="text"
      accessibilityLabel={`${prayer.name} scheduled for ${prayer.time}. Status: ${prayer.completed ? 'Completed' : 'Pending'}. Daily prayers are logged from Home.`}
      hitSlop={6}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: prayer.completed ? theme.colors.mintTint : theme.colors.surface,
          borderColor: theme.colors.border,
        },
        prayer.completed && styles.cardCompleted,
        pressed && { opacity: 0.85 },
      ]}
    >
      {/* Read-Only Status Indicator Circle */}
      <View
        style={[
          styles.checkCircle,
          prayer.completed
            ? {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              }
            : {
                backgroundColor: 'transparent',
                borderColor: theme.colors.border,
              },
        ]}
      >
        {prayer.completed ? (
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17L4 12"
              stroke={theme.colors.textInverse}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : (
          <Circle cx="12" cy="12" r="7.5" stroke={theme.colors.border} strokeWidth="1.2" />
        )}
      </View>

      {/* Middle Prayer Info */}
      <View style={styles.infoCol}>
        <View style={styles.nameRow}>
          <AppText variant="bodyMedium" color={theme.colors.text} style={styles.prayerName}>
            {t(prayer.name.toLowerCase() as any) || prayer.name}
          </AppText>
          <PrayerTimeIcon prayer={prayer.name} size={15} />
        </View>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.scheduledTime}>
          {t('scheduledAt', { time: prayer.time })}
        </AppText>
      </View>

      {/* Read-Only Status Badge */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: prayer.completed
              ? theme.colors.surface
              : theme.colors.surfaceElevated,
          },
        ]}
      >
        <AppText
          variant="caption"
          color={prayer.completed ? theme.colors.primary : theme.colors.textMuted}
          style={styles.badgeText}
        >
          {prayer.completed ? t('completed') : t('pending')}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    minHeight: 50,
  },
  cardCompleted: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  prayerName: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  scheduledTime: {
    fontWeight: '500',
    fontSize: 11,
    lineHeight: 14,
  },
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3.5,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
  },
});
