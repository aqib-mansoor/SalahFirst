import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface GeneralSettingsGroupProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onOpenPermissionsHub?: () => void;
}

export const GeneralSettingsGroup: React.FC<GeneralSettingsGroupProps> = ({
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenPermissionsHub,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={theme.colors.textSecondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.sectionLabel}>
        {t('aboutAndLegal').toUpperCase()}
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 0: Phone Permissions & Battery Hub */}
        {onOpenPermissionsHub && (
          <>
            <Pressable
              onPress={onOpenPermissionsHub}
              accessibilityRole="button"
              accessibilityLabel="Phone Permissions & Battery Setup"
              style={styles.row}
            >
              <View style={styles.leftRow}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <View style={styles.textCol}>
                  <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                    Phone Permissions & Battery
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    Ensure Azans and App Blocker work reliably
                  </AppText>
                </View>
              </View>
              {ChevronRight}
            </Pressable>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          </>
        )}
        {/* Row 1: Native Privacy Policy */}
        <Pressable
          onPress={onOpenPrivacyPolicy}
          accessibilityRole="button"
          accessibilityLabel={t('privacyPolicyMenuTitle')}
          style={styles.row}
        >
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('privacyPolicyMenuTitle')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {t('privacyPolicyMenuDesc')}
              </AppText>
            </View>
          </View>
          {ChevronRight}
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Native Terms & Conditions */}
        <Pressable
          onPress={onOpenTerms}
          accessibilityRole="button"
          accessibilityLabel={t('termsMenuTitle')}
          style={styles.row}
        >
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('termsMenuTitle')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {t('termsMenuDesc')}
              </AppText>
            </View>
          </View>
          {ChevronRight}
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 3: App Version & Offline-First Badge */}
        <View style={styles.infoRow}>
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={theme.colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                SalahFirst v1.0.0
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {t('appOfflineNotice')}
              </AppText>
            </View>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: theme.colors.surfaceSubtle }]}>
            <AppText variant="caption" color={theme.colors.accent} style={styles.pillText}>
              Offline
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs + 2,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '700',
  },
  pillBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  pillText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
