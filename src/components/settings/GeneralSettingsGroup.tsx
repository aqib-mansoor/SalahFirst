import React from 'react';
import { StyleSheet, View, Pressable, Alert, Share } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { useTranslation } from '@/context/LocalizationContext';

export interface GeneralSettingsGroupProps {
  language: string;
  onToggleLanguage: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const GeneralSettingsGroup: React.FC<GeneralSettingsGroupProps> = ({
  language,
  onToggleLanguage,
  onOpenPrivacyPolicy,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={theme.colors.textSubtle} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const handleExportBackup = async () => {
    try {
      const tracker = await storage.get(APP_CONFIG.storageKeys.prayerTracker, {});
      const streak = await storage.get(APP_CONFIG.storageKeys.streak, 0);
      const backupData = JSON.stringify(
        {
          appName: 'SalahFirst',
          version: '1.0.0',
          exportDate: new Date().toISOString(),
          prayerTracker: tracker,
          streakDays: streak,
        },
        null,
        2
      );

      await Share.share({
        message: backupData,
        title: 'SalahFirst_Backup.json',
      });
    } catch {
      Alert.alert('Backup Export', 'Could not export local JSON backup.');
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSubtle} style={styles.sectionLabel}>
        {t('general').toUpperCase()}
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Language */}
        <Pressable onPress={onToggleLanguage} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              {t('language')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              English, اردو & العربية
            </AppText>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: theme.colors.mintTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.pillText}>
              {language}
            </AppText>
          </View>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Default Focus Duration */}
        <View style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              Prayer Focus Default Duration
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Currently 15 minutes
            </AppText>
          </View>
          {ChevronRight}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 3: Backup / Export Local Data */}
        <Pressable onPress={handleExportBackup} style={styles.row}>
          <View style={styles.leftRow}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" />
            </Svg>

            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
                Backup / Export Local Data (JSON)
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Save your prayer logs & streaks offline
              </AppText>
            </View>
          </View>

          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 4: Privacy Policy */}
        <Pressable onPress={onOpenPrivacyPolicy} style={styles.row}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.privacyText}>
            SalahFirst v1.0 • Privacy Policy (Zero Tracking)
          </AppText>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={theme.colors.textSubtle} strokeWidth="2" />
            <Path d="M12 16v-4M12 8h.01" stroke={theme.colors.textSubtle} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </Pressable>
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
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  textCol: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.sm,
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
  privacyText: {
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

