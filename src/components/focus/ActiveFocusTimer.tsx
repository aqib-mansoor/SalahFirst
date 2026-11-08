import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RADIUS, PALETTE } from '@/constants/theme';
import { AppText } from '@/components/common';

export interface ActiveFocusTimerProps {
  remainingSeconds: number;
}

const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const ActiveFocusTimer: React.FC<ActiveFocusTimerProps> = ({
  remainingSeconds,
}) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timerDisplay = `${padZero(minutes)}:${padZero(seconds)}`;

  return (
    <View style={styles.outerRing}>
      <View style={styles.innerRing}>
        <View style={styles.contentColumn}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    width: 260,
    height: 260,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 18,
  },
  innerRing: {
    width: 236,
    height: 236,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentColumn: {
    alignItems: 'center',
    gap: 8,
  },
  remainingTag: {
    letterSpacing: 2,
    fontWeight: '600',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
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
    letterSpacing: 0.8,
    fontWeight: '600',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
