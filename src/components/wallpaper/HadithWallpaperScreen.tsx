import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Share, Alert, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ViewShot, { ViewShotRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
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

      const { status } = await MediaLibrary.requestPermissionsAsync();
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

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Apply ${activeTheme.name} Wallpaper`,
        });
        showToast('Wallpaper exported. Choose "Set as Wallpaper" in dialog.');
      } else {
        showToast('System wallpaper sharing is not supported on this device.');
      }
    } catch {
      showToast('Error exporting wallpaper.');
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
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header */}
      <WallpaperHeader
        themeName={activeTheme.name}
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

      {/* Interactive Swipeable Wallpaper Carousel */}
      <WallpaperCarousel
        hadith={hadith}
        activeIndex={activeThemeIndex}
        onIndexChange={setActiveThemeIndex}
      />

      {/* Hidden Render Target for High-Resolution Image Capture */}
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

      {/* 3-Button Action Dock */}
      <WallpaperActionDock
        onSaveImage={handleSaveImage}
        onSetWallpaper={handleSetWallpaper}
        onShareStatus={handleShareStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D3828',
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
