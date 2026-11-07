import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
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
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.bottomRow}>
      <Pressable
        onPress={onEmergencyCall}
        accessibilityRole="button"
        accessibilityLabel={t('emergencyCall')}
        accessibilityHint="Opens phone dialer for emergency calls"
        hitSlop={8}
        style={styles.emergencyBtn}
      >
        <AppText variant="bodySmall" color={theme.colors.accentLight} style={styles.emergencyText}>
          {t('emergencyCall')}
        </AppText>
      </Pressable>

      <Pressable
        onPress={onExitEarly}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={t('exitFocusEarly')}
        accessibilityHint="Prompts to exit the current Salah focus session"
      >
        <AppText variant="bodySmall" color={PALETTE.white} style={styles.exitText}>
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
    paddingVertical: 12,
  },
  emergencyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  emergencyText: {
    fontWeight: '600',
    fontSize: 12,
  },
  exitText: {
    fontWeight: '600',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
