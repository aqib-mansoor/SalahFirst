import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export const QiblaVerificationCard: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.mintTint }]}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="4" stroke={theme.colors.primary} strokeWidth="2" />
              <Path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldTitle}>
            {t('qiblaVerificationTitle')}
          </AppText>
        </View>

        {/* Verification Points */}
        <View style={styles.pointsList}>
          <View style={styles.pointRow}>
            <View style={[styles.bullet, { backgroundColor: theme.colors.accent }]} />
            <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.pointText}>
              {t('indoorInterferenceTip')}
            </AppText>
          </View>

          <View style={styles.pointRow}>
            <View style={[styles.bullet, { backgroundColor: theme.colors.primary }]} />
            <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.pointText}>
              {t('sunVerificationTip')}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  pointsList: {
    gap: SPACING.xs + 2,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  pointText: {
    flex: 1,
    lineHeight: 18,
    fontSize: 11,
  },
});
