import React from 'react';
import { StyleSheet, View, Pressable, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface BackupRestoreContentProps {
  isProcessing: boolean;
  statusMsg: { text: string; isError: boolean } | null;
  pasteInput: string;
  setPasteInput: (val: string) => void;
  onUploadFile: () => void;
  onRestoreFromPaste: () => void;
}

export const BackupRestoreContent: React.FC<BackupRestoreContentProps> = ({
  isProcessing,
  statusMsg,
  pasteInput,
  setPasteInput,
  onUploadFile,
  onRestoreFromPaste,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const cardBg = theme.isDark ? theme.colors.surfaceSubtle : theme.colors.background;

  return (
    <View style={styles.contentSection}>
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.desc}>
        {t('backupRestoreDesc')}
      </AppText>

      <Pressable
        onPress={onUploadFile}
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
        onPress={onRestoreFromPaste}
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
  );
};

const styles = StyleSheet.create({
  contentSection: {
    gap: SPACING.md,
  },
  desc: {
    lineHeight: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  buttonLabel: {
    fontWeight: '700',
  },
  dividerLabel: {
    textAlign: 'center',
    fontWeight: '600',
  },
  textInput: {
    height: 110,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  statusBanner: {
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

