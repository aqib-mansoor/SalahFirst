import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const highlights = (updateInfo.highlights || []).slice(0, 3);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={isForced ? undefined : onDismiss}
    >
      <View style={styles.backdrop}>
        {!isForced && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onDismiss}
            accessibilityLabel="Close update bottom sheet"
          />
        )}

        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {/* Top Indicator */}
            <View
              style={[styles.handleBar, { backgroundColor: theme.colors.border }]}
            />

            {/* Header: Icon, Title, and Version Pill */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: theme.isDark
                      ? 'rgba(16, 185, 129, 0.14)'
                      : theme.colors.mintTint,
                    borderColor: theme.isDark
                      ? theme.colors.primaryDark
                      : theme.colors.border,
                  },
                ]}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                    stroke={theme.colors.primary}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>

              <View style={styles.headerText}>
                <View style={styles.titleRow}>
                  <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
                    {isChangelogOnly ? "What's New" : updateInfo.title || 'App Update'}
                  </AppText>
                  <View
                    style={[
                      styles.versionPill,
                      {
                        backgroundColor: theme.isDark
                          ? theme.colors.surfaceSubtle
                          : theme.colors.mintTint,
                        borderColor: theme.isDark ? theme.colors.border : theme.colors.primary,
                      },
                    ]}
                  >
                    <AppText variant="caption" color={theme.colors.primary} style={styles.versionText}>
                      {isChangelogOnly
                        ? `v${currentVersion}`
                        : `v${currentVersion} → v${updateInfo.latestVersion}`}
                    </AppText>
                  </View>
                </View>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  SalahFirst Islamic Productivity
                </AppText>
              </View>
            </View>

            {/* Key Highlights (Non-scrollable, tight fit) */}
            <View
              style={[
                styles.highlightsCard,
                {
                  backgroundColor: theme.isDark
                    ? theme.colors.surfaceSubtle
                    : theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              {highlights.length > 0 ? (
                highlights.map((item, idx) => (
                  <ReleaseHighlightRow key={idx} item={item} />
                ))
              ) : (
                <AppText variant="bodySmall" color={theme.colors.textSecondary}>
                  {updateInfo.releaseNotes || 'SalahFirst is updated with fresh performance boosts.'}
                </AppText>
              )}
            </View>

            {/* Action Section */}
            <View style={styles.actions}>
              {isChangelogOnly ? (
                <Pressable
                  onPress={onDismiss}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      backgroundColor: theme.colors.primary,
                      opacity: pressed ? 0.88 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }],
                    },
                  ]}
                >
                  <AppText variant="bodyMedium" color="#FFFFFF" style={styles.buttonLabel}>
                    Got It
                  </AppText>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={handleUpdate}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      {
                        backgroundColor: theme.colors.primary,
                        opacity: pressed ? 0.88 : 1,
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                      },
                    ]}
                  >
                    <AppText variant="bodyMedium" color="#FFFFFF" style={styles.buttonLabel}>
                      Update via Play Store
                    </AppText>
                  </Pressable>

                  {!isForced && (
                    <Pressable
                      onPress={onDismiss}
                      hitSlop={10}
                      style={styles.secondaryButton}
                    >
                      <AppText variant="bodySmall" color={theme.colors.textSecondary}>
                        Later
                      </AppText>
                    </Pressable>
                  )}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    width: '100%',
  },
  sheetContainer: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderTopWidth: 1,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
  },
  versionPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 1.5,
    borderRadius: RADIUS.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  versionText: {
    fontWeight: '700',
    fontSize: 10,
  },
  highlightsCard: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  primaryButton: {
    width: '100%',
    height: 46,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
});
