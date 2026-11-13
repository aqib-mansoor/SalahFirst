import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Linking,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { SPACING, RADIUS } from '@/constants/theme';
import { AppVersionInfo } from '@/types/appVersion';
import { APP_CONFIG } from '@/constants/config';
import { ReleaseHighlightRow } from './ReleaseHighlightRow';
import Svg, { Path } from 'react-native-svg';

export interface AppUpdateBottomSheetProps {
  visible: boolean;
  updateInfo: AppVersionInfo | null;
  currentVersion: string;
  onDismiss: () => void;
  isChangelogOnly?: boolean;
}

export const AppUpdateBottomSheet: React.FC<AppUpdateBottomSheetProps> = ({
  visible,
  updateInfo,
  currentVersion,
  onDismiss,
  isChangelogOnly = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible || !updateInfo) return null;

  const isForced =
    !isChangelogOnly &&
    (updateInfo.forceUpdate === true ||
      (updateInfo.minSupportedVersionCode &&
        4 < updateInfo.minSupportedVersionCode));

  const handleUpdate = async () => {
    const playStoreUrl =
      updateInfo.playStoreUrl ||
      `market://details?id=${APP_CONFIG.updates.playStorePackage}`;
    const webFallbackUrl =
      updateInfo.webUrl ||
      `https://play.google.com/store/apps/details?id=${APP_CONFIG.updates.playStorePackage}`;

    try {
      if (Platform.OS === 'android') {
        const canOpenMarket = await Linking.canOpenURL(playStoreUrl);
        if (canOpenMarket) {
          await Linking.openURL(playStoreUrl);
          return;
        }
      }
      await Linking.openURL(webFallbackUrl);
    } catch {
      await Linking.openURL(webFallbackUrl);
    }
  };

  const highlights = updateInfo.highlights || [];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={isForced ? undefined : onDismiss}
    >
      <View style={styles.backdrop}>
        {!isForced && (
          <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        )}

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, SPACING.lg),
            },
          ]}
        >
          {/* Top Handle Indicator */}
          <View
            style={[styles.handleBar, { backgroundColor: theme.colors.border }]}
          />

          {/* Icon Badge */}
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(16, 185, 129, 0.15)'
                  : theme.colors.mintTint,
                borderColor: theme.isDark
                  ? theme.colors.primaryDark
                  : theme.colors.border,
              },
            ]}
          >
            <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                stroke={theme.colors.primary}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Title and Version Tag */}
          <View style={styles.titleRow}>
            <AppText variant="titleMedium" color={theme.colors.text} align="center">
              {isChangelogOnly
                ? "What's New in SalahFirst"
                : updateInfo.title || 'New Update Available'}
            </AppText>
            <View
              style={[
                styles.versionBadge,
                { backgroundColor: theme.colors.surfaceSubtle },
              ]}
            >
              <AppText variant="caption" color={theme.colors.textMuted}>
                {isChangelogOnly
                  ? `Installed Version: v${currentVersion}`
                  : `v${currentVersion} → v${updateInfo.latestVersion}`}
              </AppText>
            </View>
          </View>

          {/* Release Highlights / What's New Box */}
          <View
            style={[
              styles.releaseNotesBox,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <AppText variant="caption" color={theme.colors.primary} style={styles.notesHeader}>
              RELEASE HIGHLIGHTS
            </AppText>

            {highlights.length > 0 ? (
              <ScrollView
                style={styles.highlightsScroll}
                contentContainerStyle={styles.highlightsContent}
                showsVerticalScrollIndicator={false}
              >
                {highlights.map((item, idx) => (
                  <ReleaseHighlightRow key={idx} item={item} />
                ))}
              </ScrollView>
            ) : (
              <AppText variant="bodySmall" color={theme.colors.textSecondary} style={styles.notesText}>
                {updateInfo.releaseNotes ||
                  'SalahFirst is updated with fresh performance boosts and enhancements.'}
              </AppText>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionColumn}>
            {isChangelogOnly ? (
              <Pressable
                onPress={onDismiss}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  {
                    backgroundColor: theme.colors.primary,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <AppText variant="bodyMedium" color="#FFFFFF" style={styles.btnLabel}>
                  Got It
                </AppText>
              </Pressable>
            ) : (
              <>
                <Pressable
                  onPress={handleUpdate}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    {
                      backgroundColor: theme.colors.primary,
                      opacity: pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <AppText variant="bodyMedium" color="#FFFFFF" style={styles.btnLabel}>
                    Update Now via Play Store
                  </AppText>
                </Pressable>

                {!isForced && (
                  <Pressable
                    onPress={onDismiss}
                    hitSlop={10}
                    style={styles.cancelBtn}
                  >
                    <AppText variant="bodySmall" color={theme.colors.textMuted}>
                      Later (Continue with v{currentVersion})
                    </AppText>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderTopWidth: 1,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  titleRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.md,
  },
  versionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginTop: 2,
  },
  releaseNotesBox: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    maxHeight: 220,
  },
  highlightsScroll: {
    maxHeight: 160,
  },
  highlightsContent: {
    gap: SPACING.sm,
  },
  notesHeader: {
    fontWeight: '800',
    letterSpacing: 0.6,
    fontSize: 10,
  },
  notesText: {
    lineHeight: 18,
  },
  actionColumn: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});
