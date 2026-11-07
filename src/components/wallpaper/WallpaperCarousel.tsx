import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { WALLPAPER_THEMES, WallpaperTheme } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';
import { WallpaperSlide } from './WallpaperSlide';
import { SPACING, RADIUS } from '@/constants/theme';

export interface WallpaperCarouselProps {
  hadith: HadithItem;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const WallpaperCarousel: React.FC<WallpaperCarouselProps> = ({
  hadith,
  activeIndex,
  onIndexChange,
}) => {
  const { width, height } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index >= 0 && index < WALLPAPER_THEMES.length) {
      onIndexChange(index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={WALLPAPER_THEMES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <WallpaperSlide
            theme={item}
            hadith={hadith}
            width={width}
            height={height}
          />
        )}
      />

      {/* Pagination Dot Indicator */}
      <View style={styles.paginationRow}>
        {WALLPAPER_THEMES.map((theme, i) => {
          const isActive = i === activeIndex;
          return (
            <View
              key={theme.id}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationRow: {
    position: 'absolute',
    bottom: 95,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  dot: {
    height: 7,
    borderRadius: RADIUS.full,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#CCA15F',
  },
  inactiveDot: {
    width: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});

