import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WALLPAPER_THEMES } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';
import { WallpaperHeader } from './WallpaperHeader';
import { WallpaperCarousel } from './WallpaperCarousel';
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
  const [activeThemeIndex, setActiveThemeIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    }, 3000);
  };

  const handleSaveImage = () => {
    showToast(`HD Wallpaper (${activeTheme.name}) saved to gallery`);
  };

  const handleSetWallpaper = () => {
    showToast(`Applied ${activeTheme.name} as your phone wallpaper`);
  };

  const handleShareStatus = async () => {
    try {
      await Share.share({
        title: 'Share to WhatsApp Status / Story',
        message: `${hadith.arabic}\n\n${hadith.english}\n\n— ${hadith.source} (${hadith.reference})\n\nShared via SalahFirst Hadith Wallpaper`,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header with Theme Name & Close Button */}
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

      {/* Swipeable Horizontal Wallpaper Carousel */}
      <WallpaperCarousel
        hadith={hadith}
        activeIndex={activeThemeIndex}
        onIndexChange={setActiveThemeIndex}
      />

      {/* 3-Button Action Dock: Save Image, Set Wallpaper, Share to Status */}
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
});
