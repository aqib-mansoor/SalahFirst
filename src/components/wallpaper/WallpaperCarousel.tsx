import React, { useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { WALLPAPER_THEMES, WallpaperTheme } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';
import { WallpaperCarouselItem } from './WallpaperCarouselItem';
import { WallpaperPreviewMode } from './WallpaperPhoneOverlay';
import { RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface WallpaperCarouselProps {
  hadith: HadithItem;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  cardWidth: number;
  cardHeight: number;
  itemFullWidth: number;
  previewMode?: WallpaperPreviewMode;
  scrollX?: Animated.Value;
}

export const WallpaperCarousel: React.FC<WallpaperCarouselProps> = ({
  hadith,
  activeIndex,
  onIndexChange,
  cardWidth,
  cardHeight,
  itemFullWidth,
  previewMode = 'clean',
  scrollX: externalScrollX,
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const internalScrollX = useRef(new Animated.Value(0)).current;
  const scrollX = externalScrollX || internalScrollX;
  const sideSpacer = Math.max((width - itemFullWidth) / 2, 0);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemFullWidth,
      offset: itemFullWidth * index,
      index,
    }),
    [itemFullWidth]
  );

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / itemFullWidth);
      const clampedIndex = Math.max(0, Math.min(index, WALLPAPER_THEMES.length - 1));
      if (clampedIndex !== activeIndex) {
        onIndexChange(clampedIndex);
      }
    },
    [itemFullWidth, activeIndex, onIndexChange]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: WallpaperTheme; index: number }) => (
      <WallpaperCarouselItem
        item={item}
        index={index}
        hadith={hadith}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        itemFullWidth={itemFullWidth}
        scrollX={scrollX}
        previewMode={previewMode}
      />
    ),
    [hadith, cardWidth, cardHeight, itemFullWidth, scrollX, previewMode]
  );

  const isLightScreen = !WALLPAPER_THEMES[activeIndex]?.isDark;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={WALLPAPER_THEMES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemFullWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        scrollEventThrottle={16}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={false}
        contentContainerStyle={{
          paddingHorizontal: sideSpacer,
          alignItems: 'center',
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationRow} pointerEvents="none">
        {WALLPAPER_THEMES.map((t, i) => {
          const isActive = i === activeIndex;
          const inactiveDotColor = isLightScreen
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.3)';

          return (
            <View
              key={t.id}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? theme.colors.accent : inactiveDotColor,
                  width: isActive ? 22 : 6,
                },
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
    justifyContent: 'center',
  },
  paginationRow: {
    position: 'absolute',
    bottom: 86,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  dot: {
    height: 6,
    borderRadius: RADIUS.full,
  },
});
