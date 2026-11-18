import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, TextInput, Share, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import {
  generateBackupPayload,
  restoreBackupFromJson,
  downloadBackupFile,
  pickAndReadBackupFile,
  SalahFirstBackupData,
} from '@/utils/backupExportManager';
import { hydrateAllStore } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { notifyTrackerPreferencesChanged } from '@/hooks/usePrayerTracker';
import { BackupExportContent } from './BackupExportContent';

export interface BackupRestoreModalProps {
  visible: boolean;
  onClose: () => void;
}

type BackupTab = 'export' | 'restore';

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<BackupTab>('export');
  const [payload, setPayload] = useState<SalahFirstBackupData | null>(null);
  const [pasteInput, setPasteInput] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      setStatusMsg(null);
      generateBackupPayload().then(setPayload).catch(() => setPayload(null));
    }
  }, [visible]);

  const handleDownloadBackupFile = async () => {
    setIsProcessing(true);
    setStatusMsg(null);
    const saved = await downloadBackupFile(payload);
    if (saved) {
      setStatusMsg({ text: t('backupDownloadSuccess'), isError: false });
    }
    setIsProcessing(false);
  };

  const handleShareBackup = async () => {
    if (!payload) return;
    try {
      await Share.share({
        title: t('backupAndRestoreTitle'),
        message: JSON.stringify(payload, null, 2),
      });
    } catch {
      // User dismissed share sheet
    }
  };

  const executeRestore = async (jsonContent: string) => {
    setIsProcessing(true);
    setStatusMsg(null);
    const res = await restoreBackupFromJson(jsonContent);

    if (res.success) {
      await hydrateAllStore(dispatch);
      notifyTrackerPreferencesChanged();
      setStatusMsg({
        text: t('backupRestoreSuccess', { count: res.restoredCount }),
        isError: false,
      });
      setPasteInput('');
      setPayload(await generateBackupPayload());
    } else {
      setStatusMsg({ text: res.error || t('backupRestoreInvalid'), isError: true });
    }
    setIsProcessing(false);
  };

  const handleUploadBackupFile = async () => {
    Keyboard.dismiss();
    const content = await pickAndReadBackupFile();
    if (!content) return;
    await executeRestore(content);
  };

  const handleRestoreFromPaste = async () => {
    Keyboard.dismiss();
    const trimmed = pasteInput.trim();
    if (!trimmed) {
      setStatusMsg({ text: t('backupRestoreInvalid'), isError: true });
      return;
    }
    await executeRestore(trimmed);
  };

  const prayerRecordsCount = payload
    ? Math.max(
        payload.prayerLedger?.length || 0,
        Object.values(payload.prayerTracker || {}).reduce(
          (acc, day) => acc + Object.values(day || {}).filter(Boolean).length,
          0
        )
      )
    : 0;
  const sunnahDaysCount = payload ? Object.keys(payload.sunnahTracker || {}).length : 0;
  const bookmarksCount = payload ? (payload.hadithBookmarks?.length || 0) : 0;
  const cardBg = theme.isDark ? theme.colors.surfaceSubtle : theme.colors.background;

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('backupAndRestoreTitle')}
      badgeText={`v${APP_CONFIG.version}`}
      subtitleText={t('offlineFirst')}
      icon={
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
            stroke={theme.colors.primary}
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      }
    >
      <View
        style={[
          styles.segmentTrack,
          { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border },
        ]}
      >
        {(['export', 'restore'] as BackupTab[]).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => {
                Keyboard.dismiss();
                setActiveTab(tab);
                setStatusMsg(null);
              }}
              style={[
                styles.segmentItem,
                isSelected && { backgroundColor: theme.colors.primary },
              ]}
            >
              <AppText
                variant="caption"
                color={isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                style={styles.segmentText}
              >
                {tab === 'export' ? t('backupTabExport') : t('backupTabRestore')}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'export' ? (
        <BackupExportContent
          prayerRecordsCount={prayerRecordsCount}
          sunnahDaysCount={sunnahDaysCount}
          bookmarksCount={bookmarksCount}
          isProcessing={isProcessing}
          statusMsg={statusMsg}
          onDownloadFile={handleDownloadBackupFile}
          onShareText={handleShareBackup}
        />
      ) : (
        <View style={styles.contentSection}>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.desc}>
            {t('backupRestoreDesc')}
          </AppText>

          <Pressable
            onPress={handleUploadBackupFile}
            disabled={isProcessing}
            style={({ pressed }) => [
              styles.uploadButton,
              {
                backgroundColor: theme.colors.secondaryTint,
                borderColor: theme.colors.primary,
                opacity: pressed || isProcessing ? 0.85 : 1,
              },
            ]}
          >
            <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke={theme.colors.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <AppText variant="bodyMedium" color={theme.colors.primary} style={styles.buttonLabel}>
              {t('backupUploadFileButton')}
            </AppText>
          </Pressable>

          <AppText variant="caption" color={theme.colors.textMuted} style={styles.dividerLabel}>
            {t('backupOrPasteLabel')}
          </AppText>

          <TextInput
            value={pasteInput}
            onChangeText={setPasteInput}
            placeholder={t('backupPastePlaceholder')}
            placeholderTextColor={theme.colors.textMuted}
            multiline
            textAlignVertical="top"
            style={[
              styles.textInput,
              {
                backgroundColor: cardBg,
                borderColor: theme.colors.border,
                color: theme.colors.textPrimary,
              },
            ]}
          />

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

          <Pressable
            onPress={handleRestoreFromPaste}
            disabled={isProcessing}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed || isProcessing ? 0.85 : 1,
              },
            ]}
          >
            <AppText variant="bodyMedium" color={theme.colors.textOnPrimary} style={styles.buttonLabel}>
              {t('backupRestoreAction')}
            </AppText>
          </Pressable>
        </View>
      )}
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  segmentTrack: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 3,
    gap: 4,
    marginBottom: SPACING.sm + 2,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  segmentText: { fontWeight: '700', fontSize: 12 },
  contentSection: { gap: SPACING.sm + 2 },
  desc: { lineHeight: 17 },
  uploadButton: {
    width: '100%',
    height: 46,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: SPACING.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLabel: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 10.5,
    letterSpacing: 0.8,
  },
  textInput: {
    height: 92,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    fontSize: 12,
  },
  statusBanner: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  statusText: { fontWeight: '700', fontSize: 11.5 },
  primaryButton: {
    width: '100%',
    height: 46,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { fontWeight: '700', letterSpacing: 0.3 },
});
