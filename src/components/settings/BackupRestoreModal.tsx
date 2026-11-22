import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Share, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RADIUS } from '@/constants/theme';
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
import { BackupRestoreContent } from './BackupRestoreContent';

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
  const bookmarksCount = payload ? payload.hadithBookmarks?.length || 0 : 0;

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
        <BackupRestoreContent
          isProcessing={isProcessing}
          statusMsg={statusMsg}
          pasteInput={pasteInput}
          setPasteInput={setPasteInput}
          onUploadFile={handleUploadBackupFile}
          onRestoreFromPaste={handleRestoreFromPaste}
        />
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
    marginBottom: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: RADIUS.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontWeight: '700',
  },
});
