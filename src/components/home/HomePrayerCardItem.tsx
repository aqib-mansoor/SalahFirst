import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS, Theme } from '@/constants/theme';
import { AppText, PrayerTimeIcon } from '@/components/common';
import { PrayerStatus } from '@/hooks/usePrayerTracker';

export interface HomePrayerCardItemProps {
  item: PrayerStatus;
  theme: Theme;
  onPress: (item: PrayerStatus) => void;
  localizedName: string;
}

/**
 * HomePrayerCardItem
 * Runway prayer card item:
 * - Marked completed (yes): mint green surface (secondaryTint) with emerald border.
 * - Unmarked or locked: remains clean surface white (surface) with standard border.
 */
export const HomePrayerCardItem: React.FC<HomePrayerCardItemProps> = ({
  item,
  theme,
  onPress,
  localizedName,
}) => {
  const isCurrentActive = item.isCurrent;
  const isFuture = !item.hasStarted && !item.completed;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevCompleted = useRef(item.completed);

  useEffect(() => {
    if (!prevCompleted.current && item.completed) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.08, duration: 110, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }
    prevCompleted.current = item.completed;
  }, [item.completed]);

  const isCompleted = item.completed;

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={() => onPress(item)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted, disabled: isFuture }}
        accessibilityLabel={`${item.name} at ${item.time}`}
        hitSlop={6}
        style={({ pressed }) => [
          styles.capsule,
          {
            backgroundColor: isCompleted
              ? theme.colors.secondaryTint
              : theme.colors.surface,
            borderWidth: 0,
            elevation: isCompleted || isCurrentActive ? 2 : 1,
            shadowColor: isCompleted ? theme.colors.primary : '#000000',
            shadowOpacity: isCompleted ? 0.12 : 0.04,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        {/* Prayer Celestial Icon */}
        <View style={styles.iconContainer}>
          <PrayerTimeIcon prayer={item.name} size={18} />
        </View>

        {/* Prayer Name & Time */}
        <View style={styles.textStack}>
          <AppText
            variant="bodySmall"
            color={isCompleted || isCurrentActive ? theme.colors.primary : theme.colors.textPrimary}
            numberOfLines={1}
            style={styles.prayerName}
          >
            {localizedName}
          </AppText>

          <AppText
            variant="caption"
            color={isCompleted ? theme.colors.primary : theme.colors.textSecondary}
            numberOfLines={1}
            style={styles.prayerTime}
          >
            {item.time}
          </AppText>
        </View>

        {/* Status Pill Checkmark */}
        <View style={styles.statusSlot}>
          {isCompleted ? (
            <View style={[styles.completedCircle, { backgroundColor: theme.colors.primary }]}>
              <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 13L9 17L19 7"
                  stroke={theme.colors.textOnPrimary}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          ) : isCurrentActive ? (
            <View style={[styles.activeCircle, { borderColor: theme.colors.primary }]}>
              <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />
            </View>
          ) : isFuture ? (
            <View style={styles.lockIconBox}>
              <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 11H5C3.9 11 3 11.9 3 13V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V13C21 11.9 20.1 11 19 11Z"
                  stroke={theme.colors.textSecondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11"
                  stroke={theme.colors.textSecondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          ) : (
            <View style={[styles.emptyCircle, { borderColor: theme.colors.border }]} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
  },
  capsule: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 96,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStack: {
    alignItems: 'center',
    gap: 1,
  },
  prayerName: {
    fontWeight: '700',
    fontSize: 12.5,
  },
  prayerTime: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  statusSlot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lockIconBox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  emptyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.4,
  },
});
