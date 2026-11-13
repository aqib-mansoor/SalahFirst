import { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '@/constants/config';
import { storage } from '@/utils/storage';
import { AppVersionInfo } from '@/types/appVersion';
import appJson from '../../app.json';

const CURRENT_VERSION_CODE = appJson.expo.android?.versionCode ?? 4;
const CURRENT_VERSION_NAME = appJson.expo.version ?? '1.0.3';

export const useAppUpdateChecker = () => {
  const [updateInfo, setUpdateInfo] = useState<AppVersionInfo | null>(null);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);

  const checkForUpdate = useCallback(async () => {
    try {
      const response = await fetch(APP_CONFIG.updates.checkUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!response.ok) return;

      const remoteConfig: AppVersionInfo = await response.json();
      if (!remoteConfig?.latestVersionCode) return;

      const hasNewVersion = remoteConfig.latestVersionCode > CURRENT_VERSION_CODE;
      const isForced =
        remoteConfig.forceUpdate === true ||
        (remoteConfig.minSupportedVersionCode &&
          CURRENT_VERSION_CODE < remoteConfig.minSupportedVersionCode);

      if (!hasNewVersion) return;

      // If not forced, check 24h snooze window
      if (!isForced) {
        const lastDismissed = await storage.get<number | null>(
          APP_CONFIG.storageKeys.updateDismissedAt,
          null
        );
        if (lastDismissed) {
          const hoursPassed = (Date.now() - lastDismissed) / (1000 * 60 * 60);
          if (hoursPassed < APP_CONFIG.updates.snoozeHours) {
            return;
          }
        }
      }

      setUpdateInfo(remoteConfig);
      setIsUpdateVisible(true);
    } catch {
      // Offline-first graceful silence: no interruption if network fails
    }
  }, []);

  useEffect(() => {
    // Check after brief delay to avoid delaying initial screen mount
    const timer = setTimeout(() => {
      checkForUpdate();
    }, 2000);
    return () => clearTimeout(timer);
  }, [checkForUpdate]);

  const dismissUpdate = useCallback(async () => {
    setIsUpdateVisible(false);
    await storage.set(APP_CONFIG.storageKeys.updateDismissedAt, Date.now());
  }, []);

  const openChangelog = useCallback(async () => {
    if (!updateInfo) {
      try {
        const response = await fetch(APP_CONFIG.updates.checkUrl, {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (response.ok) {
          const remoteConfig: AppVersionInfo = await response.json();
          setUpdateInfo(remoteConfig);
        }
      } catch {
        // use fallback
      }
    }
    setIsUpdateVisible(true);
  }, [updateInfo]);

  return {
    isUpdateVisible,
    updateInfo,
    dismissUpdate,
    openChangelog,
    currentVersion: CURRENT_VERSION_NAME,
    currentVersionCode: CURRENT_VERSION_CODE,
  };
};

