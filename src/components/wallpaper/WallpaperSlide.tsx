import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Circle, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { AppText } from '@/components/common';
import { WallpaperTheme } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';

export interface WallpaperSlideProps {
  theme: WallpaperTheme;
  hadith: HadithItem;
  width: number;
  height: number;
}

export const WallpaperSlide: React.FC<WallpaperSlideProps> = ({
  theme,
  hadith,
  width,
  height,
}) => {
  return (
    <View
      style={[
        styles.slideContainer,
        {
          width,
          height,
          backgroundColor: theme.backgroundColor,
        },
      ]}
    >
      {/* Background Islamic Geometric Watermark */}
      <View style={styles.watermarkContainer}>
        <Svg width={260} height={260} viewBox="0 0 260 260">
          <G transform="translate(130, 130)">
            <Circle r={90} stroke={theme.watermarkColor} strokeWidth="1.5" fill="none" />
            <Circle r={40} stroke={theme.watermarkColor} strokeWidth="1" fill="none" />
            <Circle r={12} fill={theme.watermarkColor} />
            <Rect
              x="-65"
              y="-65"
              width="130"
              height="130"
              stroke={theme.watermarkColor}
              strokeWidth="2"
              fill="none"
            />
            <Rect
              x="-65"
              y="-65"
              width="130"
              height="130"
              stroke={theme.watermarkColor}
              strokeWidth="2"
              fill="none"
              transform="rotate(45)"
            />
          </G>
        </Svg>
      </View>

      {/* Centered Framed Typography Card */}
      <View
        style={[
          styles.framedCard,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        {/* Arabic Calligraphy */}
        <AppText
          variant="arabicMotto"
          color={theme.arabicColor}
          style={styles.arabicText}
        >
          {hadith.arabic}
        </AppText>

        {/* English Translation */}
        <AppText
          variant="bodyMedium"
          color={theme.englishColor}
          style={styles.englishText}
        >
          {hadith.english}
        </AppText>

        {/* Source Citation */}
        <AppText
          variant="titleSmall"
          color={theme.sourceColor}
          style={styles.sourceText}
        >
          {hadith.source.toUpperCase()}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: SPACING.lg,
  },
  watermarkContainer: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    opacity: 0.85,
  },
  framedCard: {
    width: '100%',
    maxWidth: 340,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.xxl,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: SPACING.md + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 44,
    textAlign: 'center',
    fontWeight: '700',
  },
  englishText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.95,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: SPACING.xs,
  },
});
