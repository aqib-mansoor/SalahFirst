import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Pressable, TextInput, Share, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { exportBackupToJson, restoreBackupFromJson } from '@/utils/backupExportManager';
import { hydrateAllStore } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { notifyTrackerPreferencesChanged } from '@/hooks/usePrayerTracker';

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
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<BackupTab>('export');
  const [exportJson, setExportJson] = useState<string>('');
  const [pasteInput, setPasteInput] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      setStatusMsg(null);
      exportBackupToJson().then(setExportJson).catch(() => setExportJson(''));
    }
  }, [visible]);

  if (!visible) return null;

  const handleShareBackup = async () => {
    if (!exportJson) return;
    try {
      await Share.share({
        title: t('backupAndRestoreTitle'),
        message: exportJson,
      });
    } catch {
      // User dismissed share sheet
    }
  };

  const handleRestore = async () => {
    const trimmed = pasteInput.trim();
    if (!trimmed) {
      setStatusMsg({ text: t('backupRestoreInvalid'), isError: true });
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    const res = await restoreBackupFromJson(trimmed);
    if (res.success) {
      await hydrateAllStore(dispatch);
      notifyTrackerPreferencesChanged();
      setStatusMsg({
        text: t('backupRestoreSuccess', { count: res.restoredCount }),
        isError: false,
      });
      setPasteInput('');
      const updatedJson = await exportBackupToJson();
      setExportJson(updatedJson);
    } else {
      setStatusMsg({
        text: res.error || t('backupRestoreInvalid'),
        isError: true,
      });
    }
    setIsProcessing(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, SPACING.lg),
            },
          ]}
        >
          <View style={styles.handleBar}>
            <View style={[styles.handleIndicator, { backgroundColor: theme.colors.border }]} />
          </View>

          <View style={styles.header}>
            <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
              {t('backupAndRestoreTitle')}
            </AppText>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.textSecondary} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          {/* 2-Tab Segmented Switcher */}
          <View style={[styles.segmentTrack, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
            {(['export', 'restore'] as BackupTab[]).map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => {
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
            <View style={styles.body}>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.desc}>
                {t('backupExportDesc')}
              </AppText>

              <ScrollView
                style={[styles.codePreviewBox, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}
                nestedScrollEnabled
              >
                <AppText
                  variant="caption"
                  color={theme.colors.textPrimary}
                  selectable
                  style={styles.codeText}
                >
                  {exportJson}
                </AppText>
              </ScrollView>

              <AppButton
                label={t('backupShareButton')}
                onPress={handleShareBackup}
                variant="primary"
                size="md"
              />
            </View>
          ) : (
            <View style={styles.body}>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.desc}>
                {t('backupRestoreDesc')}
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
                    backgroundColor: theme.colors.surfaceSubtle,
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
                      backgroundColor: statusMsg.isError ? theme.colors.warningBg : theme.colors.secondaryTint,
                      borderColor: statusMsg.isError ? theme.colors.warningBorder : theme.colors.primary,
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

              <AppButton
                label={t('backupRestoreAction')}
                onPress={handleRestore}
                loading={isProcessing}
                disabled={isProcessing}
                variant="gold"
                size="md"
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  backdrop: { ...StyleSheet.absoluteFill },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm + 2,
  },
  handleBar: { alignItems: 'center', paddingVertical: SPACING.xs + 2 },
  handleIndicator: { width: 36, height: 4, borderRadius: RADIUS.full },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '700' },
  closeBtn: { padding: SPACING.xs },
  segmentTrack: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm + 2,
  },
  segmentText: { fontWeight: '700', fontSize: 12 },
  body: { gap: SPACING.sm + 2, paddingTop: 2 },
  desc: { lineHeight: 17 },
  codePreviewBox: {
    maxHeight: 150,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm + 2,
  },
  codeText: { fontSize: 10.5, lineHeight: 15 },
  textInput: {
    height: 120,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm + 2,
    fontSize: 12,
  },
  statusBanner: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  statusText: { fontWeight: '700', fontSize: 11.5 },
});
