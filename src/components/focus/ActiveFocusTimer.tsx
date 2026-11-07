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
      <View style={styles.contentColumn}>
        <AppText variant="caption" color={PALETTE.goldLight} style={styles.remainingTag}>
          REMAINING
        </AppText>

        <AppText variant="brandTitle" color={PALETTE.white} style={styles.timerNumber}>
          {timerDisplay}
        </AppText>

        <AppText variant="caption" color={PALETTE.goldLight} style={styles.dndTag}>
          DND Active
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    width: 250,
    height: 250,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: PALETTE.gold,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  contentColumn: {
    alignItems: 'center',
    gap: 4,
  },
  remainingTag: {
    letterSpacing: 2,
    fontWeight: '700',
    opacity: 0.9,
  },
  timerNumber: {
    fontSize: 52,
    lineHeight: 60,
    fontWeight: '800',
    letterSpacing: -1,
  },
  dndTag: {
    letterSpacing: 1.2,
    fontWeight: '600',
    opacity: 0.9,
  },
});

