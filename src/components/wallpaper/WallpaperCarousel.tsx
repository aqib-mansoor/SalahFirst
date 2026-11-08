import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { WALLPAPER_THEMES } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';
import { WallpaperSlide } from './WallpaperSlide';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

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
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;

  // Proportional Phone Mockup Dimensions
  const cardWidth = Math.round(width * 0.72);
  const cardHeight = Math.round(height * 0.63);
  const itemSpacing = SPACING.sm;
  const itemFullWidth = cardWidth + itemSpacing * 2;
  const sideSpacer = (width - itemFullWidth) / 2;

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemFullWidth);
    if (index >= 0 && index < WALLPAPER_THEMES.length) {
      onIndexChange(index);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={WALLPAPER_THEMES}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemFullWidth}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: Math.max(sideSpacer, 0),
          alignItems: 'center',
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * itemFullWidth,
            index * itemFullWidth,
            (index + 1) * itemFullWidth,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.88, 1, 0.88],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.55, 1, 0.55],
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
              {/* Phone Mockup Frame */}
              <View
                style={[
                  styles.phoneFrame,
                  {
                    width: cardWidth,
                    height: cardHeight,
                  },
                ]}
              >
                {/* Top Phone Notch / Dynamic Island */}
                <View style={styles.dynamicIsland} />

                {/* Wallpaper Render Target */}
                <WallpaperSlide
                  theme={item}
                  hadith={hadith}
                  width={cardWidth}
                  height={cardHeight}
                  isPhonePreview={true}
                />
              </View>
            </Animated.View>
          );
        }}
      />

      {/* Modern Animated Dot Indicators */}
      <View style={styles.paginationRow}>
        {WALLPAPER_THEMES.map((t, i) => {
          const isActive = i === activeIndex;
          return (
            <View
              key={t.id}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive
                    ? theme.colors.accent
                    : 'rgba(255, 255, 255, 0.3)',
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
  slideItemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.28)',
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
