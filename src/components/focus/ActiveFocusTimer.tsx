import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RADIUS, PALETTE } from '@/constants/theme';
import { AppText } from '@/components/common';

export interface ActiveFocusTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
}

const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const SIZE = 264;
const STROKE_WIDTH = 5;
const RADIUS_VAL = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS_VAL;

export const ActiveFocusTimer: React.FC<ActiveFocusTimerProps> = ({
  remainingSeconds,
  totalSeconds,
}) => {
  const safeTotal = totalSeconds > 0 ? totalSeconds : 1;
  const progress = Math.max(0, Math.min(1, remainingSeconds / safeTotal));
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timerDisplay = `${padZero(minutes)}:${padZero(seconds)}`;

  return (
    <View style={styles.container}>
      {/* SVG Progress Dial */}
      <Svg width={SIZE} height={SIZE} style={styles.svgDial}>
        <Defs>
          <LinearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6EE7B7" />
            <Stop offset="50%" stopColor="#34D399" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>

        {/* Ambient Track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS_VAL}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Dynamic Countdown Arc */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS_VAL}
          stroke="url(#arcGrad)"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      {/* Frosted Center Core */}
      <View style={styles.frostedCore}>
        <AppText variant="caption" style={styles.remainingTag}>
          TIME REMAINING
        </AppText>

        <AppText variant="brandTitle" color={PALETTE.white} style={styles.timerNumber}>
          {timerDisplay}
        </AppText>

        <View style={styles.shieldBadge}>
          <View style={styles.liveIndicator} />
          <AppText variant="caption" style={styles.shieldText}>
            Distraction Shield
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 14,
  },
  svgDial: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  frostedCore: {
    width: SIZE - 28,
    height: SIZE - 28,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(5, 35, 23, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  remainingTag: {
    letterSpacing: 2.2,
    fontWeight: '600',
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  timerNumber: {
    fontSize: 54,
    lineHeight: 62,
    fontWeight: '800',
    letterSpacing: -1,
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: RADIUS.full,
    marginTop: 2,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  shieldText: {
    letterSpacing: 0.6,
    fontWeight: '600',
    fontSize: 11,
    color: '#A7F3D0',
  },
});
