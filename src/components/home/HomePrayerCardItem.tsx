import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS, Theme } from '@/constants/theme';
import { AppText } from '@/components/common';
import { PrayerStatus } from '@/hooks/usePrayerTracker';

export interface HomePrayerCardItemProps {
  item: PrayerStatus;
  theme: Theme;
  onPress: (item: PrayerStatus) => void;
  localizedName: string;
}

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

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={() => onPress(item)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed, disabled: isFuture }}
        accessibilityLabel={`${item.name} at ${item.time}`}
        hitSlop={6}
        style={({ pressed }) => [
          styles.prayerCard,
          {
            backgroundColor: isCurrentActive
              ? theme.colors.secondaryTint
              : item.completed
              ? theme.colors.surfaceSubtle
              : theme.colors.surface,
            borderColor: isCurrentActive
              ? theme.colors.accent
              : item.completed
              ? theme.colors.primary
              : theme.colors.border,
            borderWidth: isCurrentActive ? 1.6 : 1,
            opacity: 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
      {/* Islamic Arch & Star Canvas Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 60 90" preserveAspectRatio="none">
          <Path
            d="M 8,90 L 8,42 Q 8,14 30,5 Q 52,14 52,42 L 52,90"
            stroke={isCurrentActive ? theme.colors.accent : item.completed ? theme.colors.primary : theme.colors.border}
            strokeWidth={isCurrentActive ? 1.1 : 0.8}
            strokeDasharray={isCurrentActive ? undefined : '2 2'}
            opacity={isCurrentActive ? 0.32 : item.completed ? 0.22 : 0.15}
            fill="none"
          />
          <Path
            d="M 30,5 L 31.5,8 L 34.5,8 L 32,10 L 33,13 L 30,11.5 L 27,13 L 28,10 L 25.5,8 L 28.5,8 Z"
            fill={isCurrentActive ? theme.colors.accent : item.completed ? theme.colors.primary : 'none'}
            opacity={isCurrentActive ? 0.40 : item.completed ? 0.25 : 0}
          />
        </Svg>
      </View>

      {isCurrentActive && (
        <View style={[styles.activeNowBadge, { backgroundColor: theme.colors.accent }]}>
          <AppText variant="caption" color={theme.colors.textOnAccent} style={styles.nowBadgeText}>
            NOW
          </AppText>
        </View>
      )}

      <AppText
        variant="bodySmall"
        color={isCurrentActive ? theme.colors.primary : theme.colors.textPrimary}
        numberOfLines={1}
        style={styles.prayerName}
      >
        {localizedName}
      </AppText>

      <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1} style={styles.prayerTime}>
        {item.time}
      </AppText>

      {/* Status Circle Indicator */}
      <View style={styles.circleContainer}>
        {item.completed ? (
          <View style={[styles.completedCircle, { backgroundColor: theme.colors.primary }]}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path d="M5 13L9 17L19 7" stroke={theme.colors.textOnPrimary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        ) : isCurrentActive ? (
          <View style={[styles.currentCircle, { borderColor: theme.colors.accent }]}>
            <View style={[styles.innerGoldDot, { backgroundColor: theme.colors.accent }]} />
          </View>
        ) : isFuture ? (
          <View style={styles.lockIconBox}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path d="M19 11H5C3.9 11 3 11.9 3 13V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V13C21 11.9 20.1 11 19 11Z" stroke={theme.colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" stroke={theme.colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  prayerCard: {
    flex: 1,
    minHeight: 88,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  activeNowBadge: {
    position: 'absolute',
    top: -8,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: RADIUS.full,
    zIndex: 2,
  },
  nowBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  prayerName: {
    fontWeight: '700',
    fontSize: 13,
  },
  prayerTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  circleContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  completedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGoldDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lockIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});

