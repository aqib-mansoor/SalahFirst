import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Share,
  Alert,
  Platform,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ViewShot, { ViewShotRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { WALLPAPER_THEMES } from '@/constants/wallpaperThemes';
import { SPACING } from '@/constants/theme';
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

  // Proportional phone mockup sizes
  const cardWidth = Math.round(width * 0.72);
  const cardHeight = Math.round(height * 0.63);
  const itemFullWidth = cardWidth + SPACING.sm * 2;
  const scrollX = useRef(new Animated.Value(0)).current;

  const activeTheme = WALLPAPER_THEMES[activeThemeIndex];

  // Dynamic real-time ambient background interpolation
  const bgInterpolation = scrollX.interpolate({
    inputRange: WALLPAPER_THEMES.map((_, i) => i * itemFullWidth),
    outputRange: WALLPAPER_THEMES.map((t) => t.ambientBackground),
    extrapolate: 'clamp',
  });

  // Track active index as the user swipes
  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      const nextIdx = Math.min(
        Math.max(Math.round(value / itemFullWidth), 0),
        WALLPAPER_THEMES.length - 1
      );
      setActiveThemeIndex((prev) => (prev !== nextIdx ? nextIdx : prev));
    });
    return () => {
      scrollX.removeListener(listenerId);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [itemFullWidth]);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3500);
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
          await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Save Hadith Wallpaper' });
        } else {
          Alert.alert('Permission Required', 'Please allow photo library access in device settings.');
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
      if (await Sharing.isAvailableAsync()) {
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
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share Hadith Wallpaper' });
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
    <Animated.View style={[styles.container, { backgroundColor: bgInterpolation }]}>
      <StatusBar style={activeTheme.isDark ? 'light' : 'dark'} />

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
          <HadithToast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        </View>
      )}

      {/* 3D Phone Mockup Animated Carousel with Continuous Cross-Fade */}
      <WallpaperCarousel
        hadith={hadith}
        activeIndex={activeThemeIndex}
        onIndexChange={setActiveThemeIndex}
        scrollX={scrollX}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        itemFullWidth={itemFullWidth}
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

      {/* Streamlined 3-Action Dock: Save, Set Wallpaper (Luminous Gold), Share */}
      <WallpaperActionDock
        onSaveImage={handleSaveImage}
        onSetWallpaper={handleSetWallpaper}
        onShareStatus={handleShareStatus}
        isProcessing={isProcessing}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
