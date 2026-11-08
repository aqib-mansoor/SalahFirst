import React, { memo } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { WallpaperTheme } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';
import { WallpaperSlide } from './WallpaperSlide';
import { WallpaperPhoneOverlay, WallpaperPreviewMode } from './WallpaperPhoneOverlay';
import { RADIUS } from '@/constants/theme';

export interface WallpaperCarouselItemProps {
  item: WallpaperTheme;
  index: number;
  hadith: HadithItem;
  cardWidth: number;
  cardHeight: number;
  itemFullWidth: number;
  scrollX: Animated.Value;
  previewMode: WallpaperPreviewMode;
}

const WallpaperCarouselItemComponent: React.FC<WallpaperCarouselItemProps> = ({
  item,
  index,
  hadith,
  cardWidth,
  cardHeight,
  itemFullWidth,
  scrollX,
  previewMode,
}) => {
    const inputRange = [
      (index - 1) * itemFullWidth,
      index * itemFullWidth,
      (index + 1) * itemFullWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.65, 1, 0.65],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.slideItemWrapper,
          {
            width: itemFullWidth,
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View
          style={[
            styles.phoneFrame,
            {
              width: cardWidth,
              height: cardHeight,
              borderColor: item.isDark
                ? 'rgba(255, 255, 255, 0.28)'
                : 'rgba(0, 0, 0, 0.12)',
            },
          ]}
        >
          {/* Top Notch / Dynamic Island */}
          <View style={styles.dynamicIsland} />

          {/* Wallpaper Content */}
          <WallpaperSlide
            theme={item}
            hadith={hadith}
            width={cardWidth}
            height={cardHeight}
            isPhonePreview={true}
          />

          {/* Lock / Home Screen Overlay */}
          <WallpaperPhoneOverlay
            mode={previewMode}
            isDarkTheme={item.isDark}
            width={cardWidth}
            height={cardHeight}
          />
        </View>
      </Animated.View>
    );
  };

export const WallpaperCarouselItem = memo(WallpaperCarouselItemComponent);

const styles = StyleSheet.create({
  slideItemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    borderRadius: 32,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
  },
  dynamicIsland: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    width: 60,
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
});

