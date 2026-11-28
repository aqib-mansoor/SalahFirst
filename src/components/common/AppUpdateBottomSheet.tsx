import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { AppBottomSheet } from './AppBottomSheet';
import { SPACING, RADIUS } from '@/constants/theme';
import { AppVersionInfo } from '@/types/appVersion';
import { APP_CONFIG } from '@/constants/config';
import { ReleaseHighlightRow } from './ReleaseHighlightRow';
import { useTranslation } from '@/context/LocalizationContext';
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
  const { t } = useTranslation();

  if (!visible || !updateInfo) return null;

  const isForced =
    !isChangelogOnly &&
    (updateInfo.forceUpdate === true ||
      Boolean(
        updateInfo.minSupportedVersionCode &&
          4 < updateInfo.minSupportedVersionCode
      ));

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

  const fallbackHighlights = [
    {
      tag: t('whatsNewHighlight1Tag'),
      description: t('whatsNewHighlight1Desc'),
    },
    {
      tag: t('whatsNewHighlight2Tag'),
      description: t('whatsNewHighlight2Desc'),
    },
    {
      tag: t('whatsNewHighlight3Tag'),
      description: t('whatsNewHighlight3Desc'),
    },
  ];

  const highlights =
    isChangelogOnly || !updateInfo.highlights?.length
      ? fallbackHighlights
      : updateInfo.highlights.slice(0, 3);

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        stroke={theme.colors.primary}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onDismiss}
      disableDismiss={isForced}
      showCloseButton={false}
      title={isChangelogOnly ? t('whatsNewTitle') : updateInfo.title || t('appUpdateTitle')}
      badgeText={
        isChangelogOnly
          ? `${t('version')} v${currentVersion}`
          : `v${currentVersion} → v${updateInfo.latestVersion}`
      }
      subtitleText={t('verifiedReleaseSub')}
      icon={headerIcon}
    >
      {/* Key Highlights */}
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
            {updateInfo.releaseNotes || "As'Salah is updated with fresh performance boosts."}
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
            <AppText variant="bodyMedium" color={theme.colors.textOnPrimary} style={styles.buttonLabel}>
              {t('gotItAction')}
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
              <AppText variant="bodyMedium" color={theme.colors.textOnPrimary} style={styles.buttonLabel}>
                {t('updateViaPlayStore')}
              </AppText>
            </Pressable>

            {!isForced && (
              <Pressable
                onPress={onDismiss}
                hitSlop={10}
                style={styles.secondaryButton}
              >
                <AppText variant="bodySmall" color={theme.colors.textSecondary}>
                  {t('laterAction')}
                </AppText>
              </Pressable>
            )}
          </>
        )}
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
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
