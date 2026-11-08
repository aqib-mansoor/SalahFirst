import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Circle, G, Path } from 'react-native-svg';
import { SPACING } from '@/constants/theme';
import { AppText } from '@/components/common';
import { WallpaperTheme } from '@/constants/wallpaperThemes';
import { HadithItem } from '@/data/hadiths';

export interface WallpaperSlideProps {
  theme: WallpaperTheme;
  hadith: HadithItem;
  width: number;
  height: number;
  isPhonePreview?: boolean;
}

export const WallpaperSlide: React.FC<WallpaperSlideProps> = ({
  theme,
  hadith,
  width,
  height,
  isPhonePreview = false,
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
      {/* Sacred Geometric Watermark (Subtle Illuminated Background) */}
      <View style={[styles.watermarkContainer, isPhonePreview && styles.watermarkPreview]} pointerEvents="none">
        <Svg width={isPhonePreview ? 220 : 360} height={isPhonePreview ? 220 : 360} viewBox="0 0 260 260">
          <G transform="translate(130, 130)">
            <Circle r={105} stroke={theme.watermarkColor} strokeWidth="1.2" fill="none" />
            <Circle r={60} stroke={theme.watermarkColor} strokeWidth="1" fill="none" />
            <Circle r={8} fill={theme.watermarkColor} />
            <Rect x="-72" y="-72" width="144" height="144" stroke={theme.watermarkColor} strokeWidth="1.5" fill="none" />
            <Rect x="-72" y="-72" width="144" height="144" stroke={theme.watermarkColor} strokeWidth="1.5" fill="none" transform="rotate(45)" />
          </G>
        </Svg>
      </View>

      {/* Borderless Sacred Lockscreen Canvas */}
      <View style={[styles.canvas, isPhonePreview ? styles.canvasPreview : styles.canvasFull]}>
        {/* Top Clock Space (Lockscreen Breathing Zone) */}
        <View style={isPhonePreview ? styles.clockSpacePreview : styles.clockSpaceFull} />

        {/* Central Sacred Calligraphy & Wisdom Body */}
        <View style={styles.contentBody}>
          {/* Top Delicate Sacred Starlet */}
          <View style={styles.starletFlourish}>
            <Svg width={isPhonePreview ? 20 : 28} height={isPhonePreview ? 20 : 28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                stroke={theme.sourceColor}
                strokeWidth="1.5"
                fill="none"
              />
              <Circle cx="12" cy="12" r="2.2" fill={theme.sourceColor} />
            </Svg>
          </View>

          {/* Majestic Arabic Calligraphy */}
          <AppText
            variant="arabicMotto"
            color={theme.arabicColor}
            style={[styles.arabicText, isPhonePreview ? styles.arabicPreview : styles.arabicFull]}
          >
            {hadith.arabic}
          </AppText>

          {/* Elegant Sacred Flourish Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerHairline, { backgroundColor: theme.sourceColor }]} />
            <View style={[styles.centerDiamond, { backgroundColor: theme.sourceColor }]} />
            <View style={[styles.dividerHairline, { backgroundColor: theme.sourceColor }]} />
          </View>

          {/* Clean Modern English Wisdom Translation */}
          <AppText
            variant="bodyMedium"
            color={theme.englishColor}
            style={[styles.englishText, isPhonePreview ? styles.englishPreview : styles.englishFull]}
          >
            "{hadith.english}"
          </AppText>

          {/* Authenticated Source Citation */}
          <AppText
            variant="titleSmall"
            color={theme.sourceColor}
            style={[styles.sourceText, isPhonePreview ? styles.sourcePreview : styles.sourceFull]}
          >
            {hadith.source.toUpperCase()} {hadith.reference && `• ${hadith.reference}`}
          </AppText>
        </View>

        {/* Bottom Lockscreen Signature */}
        <View style={styles.bottomSignature}>
          <AppText variant="caption" color={theme.sourceColor} style={styles.brandTitle}>
            SALAHFIRST
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: '24%',
    alignSelf: 'center',
    opacity: 0.9,
  },
  watermarkPreview: {
    top: '20%',
  },
  canvas: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  canvasPreview: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  canvasFull: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl * 1.5,
  },
  clockSpacePreview: {
    height: '18%',
  },
  clockSpaceFull: {
    height: '24%',
  },
  contentBody: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm + 2,
  },
  starletFlourish: {
    opacity: 0.9,
    marginBottom: 2,
  },
  arabicText: {
    textAlign: 'center',
    fontWeight: '700',
  },
  arabicPreview: {
    fontSize: 18,
    lineHeight: 32,
    paddingHorizontal: 2,
  },
  arabicFull: {
    fontSize: 32,
    lineHeight: 54,
    paddingHorizontal: SPACING.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    gap: 8,
    marginVertical: 4,
  },
  dividerHairline: {
    flex: 1,
    height: 1,
    opacity: 0.45,
  },
  centerDiamond: {
    width: 5,
    height: 5,
    transform: [{ rotate: '45deg' }],
  },
  englishText: {
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.95,
  },
  englishPreview: {
    fontSize: 11,
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  englishFull: {
    fontSize: 16,
    lineHeight: 25,
    paddingHorizontal: SPACING.lg,
  },
  sourceText: {
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 4,
  },
  sourcePreview: {
    fontSize: 9,
    letterSpacing: 1.1,
  },
  sourceFull: {
    fontSize: 12,
    letterSpacing: 1.8,
  },
  bottomSignature: {
    paddingBottom: SPACING.xs,
    opacity: 0.4,
  },
  brandTitle: {
    letterSpacing: 3.5,
    fontWeight: '800',
    fontSize: 9,
    textTransform: 'uppercase',
  },
});
