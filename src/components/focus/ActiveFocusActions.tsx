import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { RADIUS, PALETTE } from '@/constants/theme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface ActiveFocusActionsProps {
  onEmergencyCall: () => void;
  onExitEarly: () => void;
}

export const ActiveFocusActions: React.FC<ActiveFocusActionsProps> = ({
  onEmergencyCall,
  onExitEarly,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.bottomRow, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}>
      <Pressable
        onPress={onEmergencyCall}
        accessibilityRole="button"
        accessibilityLabel={t('emergencyCall')}
        accessibilityHint="Opens phone dialer for emergency calls"
        style={({ pressed }) => [
          styles.pillButton,
          styles.emergencyPill,
          pressed && styles.pressed,
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeWidth={2}>
          <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Svg>
        <AppText variant="caption" color={PALETTE.white} style={styles.pillText}>
          {t('emergencyCall')}
        </AppText>
      </Pressable>

      <Pressable
        onPress={onExitEarly}
        accessibilityRole="button"
        accessibilityLabel={t('exitFocusEarly')}
        accessibilityHint="Prompts to exit the current Salah focus session"
        style={({ pressed }) => [
          styles.pillButton,
          styles.exitPill,
          pressed && styles.pressed,
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth={2}>
          <Path d="M18 6L6 18M6 6l12 12" />
        </Svg>
        <AppText variant="caption" style={styles.exitText}>
          {t('exitFocusEarly')}
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    gap: 12,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    backgroundColor: 'rgba(5, 35, 23, 0.65)',
  },
  emergencyPill: {
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  exitPill: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  pillText: {
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  exitText: {
    fontWeight: '600',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.2,
  },
});
