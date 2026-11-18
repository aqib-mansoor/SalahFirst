import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, ReleaseHighlightRow } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface BackupExportContentProps {
  prayerRecordsCount: number;
  sunnahDaysCount: number;
  bookmarksCount: number;
  isProcessing: boolean;
  statusMsg: { text: string; isError: boolean } | null;
  onDownloadFile: () => void;
  onShareText: () => void;
}

export const BackupExportContent: React.FC<BackupExportContentProps> = ({
  prayerRecordsCount,
  sunnahDaysCount,
  bookmarksCount,
  isProcessing,
  statusMsg,
  onDownloadFile,
  onShareText,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const cardBg = theme.isDark ? theme.colors.surfaceSubtle : theme.colors.background;

  return (
    <View style={styles.contentSection}>
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.desc}>
        {t('backupExportDesc')}
      </AppText>

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: cardBg, borderColor: theme.colors.border },
        ]}
      >
        {[
          { tag: t('backupTagPrayers'), description: t('backupSummaryPrayers', { count: prayerRecordsCount }) },
          { tag: t('backupTagSunnah'), description: t('backupSummarySunnah', { count: sunnahDaysCount }) },
          { tag: t('backupTagBookmarks'), description: t('backupSummaryBookmarks', { count: bookmarksCount }) },
        ].map((item, idx) => (
          <ReleaseHighlightRow key={idx} item={item} />
        ))}
      </View>

      {statusMsg && (
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: statusMsg.isError
                ? theme.colors.warningBg
                : theme.colors.secondaryTint,
              borderColor: statusMsg.isError
                ? theme.colors.warningBorder
                : theme.colors.primary,
            },
          ]}
        >
          <AppText
            variant="caption"
            color={statusMsg.isError ? theme.colors.warning : theme.colors.primary}
            style={styles.statusText}
          >
            {statusMsg.text}
          </AppText>
        </View>
      )}

      <View style={styles.buttonGroup}>
        <Pressable
          onPress={onDownloadFile}
          disabled={isProcessing}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: pressed || isProcessing ? 0.85 : 1,
            },
          ]}
        >
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
              stroke={theme.colors.textOnPrimary}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <AppText variant="bodyMedium" color={theme.colors.textOnPrimary} style={styles.buttonLabel}>
            {t('backupDownloadFileButton')}
          </AppText>
        </Pressable>

        <Pressable
          onPress={onShareText}
          disabled={isProcessing}
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: cardBg,
              borderColor: theme.colors.border,
              opacity: pressed || isProcessing ? 0.85 : 1,
            },
          ]}
        >
          <AppText variant="bodyMedium" color={theme.colors.textPrimary} style={styles.buttonLabel}>
            {t('backupShareButton')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentSection: { gap: SPACING.md },
  desc: { lineHeight: 17 },
  summaryCard: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  statusBanner: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  statusText: { fontWeight: '700', fontSize: 11.5 },
  buttonGroup: { gap: SPACING.sm },
  primaryButton: {
    width: '100%',
    height: 46,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    gap: SPACING.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    width: '100%',
    height: 44,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { fontWeight: '700', letterSpacing: 0.3 },
});

