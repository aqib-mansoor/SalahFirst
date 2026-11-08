import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Share,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ViewShot, { ViewShotRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { WALLPAPER_THEMES } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';
import { WallpaperHeader } from './WallpaperHeader';
import { WallpaperCarousel } from './WallpaperCarousel';
import { WallpaperSlide } from './WallpaperSlide';
import { WallpaperActionDock } from './WallpaperActionDock';
import { HadithToast } from '@/components/hadith/HadithToast';

export interface HadithWallpaperScreenProps {
  hadith: HadithItem;
  onClose: () => void;
}

export const HadithWallpaperScreen: React.FC<HadithWallpaperScreenProps> = ({
  hadith,
  onClose,
}) => {
  const { width, height } = useWindowDimensions();
  const [activeThemeIndex, setActiveThemeIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const captureViewRef = useRef<ViewShotRef>(null);

  const activeTheme = WALLPAPER_THEMES[activeThemeIndex];

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const captureActiveWallpaper = async (): Promise<string | null> => {
    try {
      if (!captureViewRef.current?.capture) return null;
      return await captureViewRef.current.capture();
    } catch {
      return null;
    }
  };

  const handleSaveImage = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const uri = await captureActiveWallpaper();
      if (!uri) {
        showToast('Failed to generate wallpaper image.');
        setIsProcessing(false);
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri);
        showToast(`HD Wallpaper (${activeTheme.name}) saved to gallery!`);
      } else {
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Save Hadith Wallpaper',
          });
        } else {
          Alert.alert(
            'Permission Required',
            'Please allow photo library access in device settings to save wallpapers directly to your gallery.'
          );
        }
      }
    } catch {
      showToast('Error saving wallpaper to device.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetWallpaper = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const uri = await captureActiveWallpaper();
      if (!uri) {
        showToast('Failed to generate wallpaper image.');
        setIsProcessing(false);
        return;
      }

      let contentUri = uri;
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        contentUri = asset.uri;
      }

      if (Platform.OS === 'android') {
        try {
          await IntentLauncher.startActivityAsync('android.intent.action.ATTACH_DATA', {
            data: contentUri,
            type: 'image/png',
            flags: 1,
          });
          showToast('Select "Wallpaper" to set Home or Lock screen.');
          return;
        } catch {
          // Intent fallback
        }
      }

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Set ${activeTheme.name} Wallpaper`,
        });
        showToast('Choose "Set as Wallpaper" in system dialog.');
      }
    } catch {
      showToast('Error setting wallpaper.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareStatus = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const uri = await captureActiveWallpaper();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Hadith Wallpaper',
        });
      } else {
        await Share.share({
          title: 'Share Authentic Hadith',
          message: `${hadith.arabic}\n\n${hadith.english}\n\n— ${hadith.source} (${hadith.reference})\n\nShared via SalahFirst`,
        });
      }
    } catch {
      showToast('Error sharing wallpaper.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: activeTheme.ambientBackground },
      ]}
    >
      <StatusBar style="light" />

      {/* Top Header with Theme Name & 1/4 Counter */}
      <WallpaperHeader
        themeName={activeTheme.name}
        currentIndex={activeThemeIndex}
        totalThemes={WALLPAPER_THEMES.length}
        onClose={onClose}
      />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <View style={styles.toastOverlay}>
          <HadithToast
            message={toastMessage}
            onDismiss={() => setToastMessage(null)}
          />
        </View>
      )}

      {/* 3D Phone Mockup Animated Carousel */}
      <WallpaperCarousel
        hadith={hadith}
        activeIndex={activeThemeIndex}
        onIndexChange={setActiveThemeIndex}
      />

      {/* Hidden Render Target for Full-Resolution Capture */}
      <ViewShot
        ref={captureViewRef}
        options={{ format: 'png', quality: 1.0 }}
        style={[styles.hiddenCaptureView, { width, height }]}
      >
        <WallpaperSlide
          theme={activeTheme}
          hadith={hadith}
          width={width}
          height={height}
        />
      </ViewShot>

      {/* Streamlined 3-Action Dock: Save, Set Wallpaper, Share */}
      <WallpaperActionDock
        onSaveImage={handleSaveImage}
        onSetWallpaper={handleSetWallpaper}
        onShareStatus={handleShareStatus}
        isProcessing={isProcessing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041710',
  },
  toastOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  hiddenCaptureView: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },
});
