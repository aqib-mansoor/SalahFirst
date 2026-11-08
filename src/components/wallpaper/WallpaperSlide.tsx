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
  const framePadding = isPhonePreview ? 14 : 28;

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
      {/* Background Sacred Geometric Watermark */}
      <View style={[styles.watermarkContainer, isPhonePreview && styles.watermarkPreview]} pointerEvents="none">
        <Svg width={isPhonePreview ? 200 : 320} height={isPhonePreview ? 200 : 320} viewBox="0 0 260 260">
          <G transform="translate(130, 130)">
            <Circle r={100} stroke={theme.watermarkColor} strokeWidth="1.5" fill="none" />
            <Circle r={55} stroke={theme.watermarkColor} strokeWidth="1" fill="none" />
            <Circle r={10} fill={theme.watermarkColor} />
            <Rect x="-70" y="-70" width="140" height="140" stroke={theme.watermarkColor} strokeWidth="1.8" fill="none" />
            <Rect x="-70" y="-70" width="140" height="140" stroke={theme.watermarkColor} strokeWidth="1.8" fill="none" transform="rotate(45)" />
          </G>
        </Svg>
      </View>

      {/* Sacred Manuscript Perimeter Frame (No floating box) */}
      <View
        style={[
          styles.manuscriptFrame,
          {
            margin: framePadding,
            borderColor: theme.cardBorder,
            borderRadius: isPhonePreview ? 18 : 28,
          },
        ]}
      >
        {/* Top Sacred Star Ornament */}
        <View style={styles.topOrnament}>
          <Svg width={isPhonePreview ? 22 : 32} height={isPhonePreview ? 22 : 32} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
              stroke={theme.sourceColor}
              strokeWidth="1.5"
              fill="none"
            />
            <Circle cx="12" cy="12" r="2" fill={theme.sourceColor} />
          </Svg>
        </View>

        {/* Central Fluid Typography Body */}
        <View style={styles.typographyBody}>
          {/* Majestic Arabic Calligraphy */}
          <AppText
            variant="arabicMotto"
            color={theme.arabicColor}
            style={[styles.arabicText, isPhonePreview && styles.arabicTextPreview]}
          >
            {hadith.arabic}
          </AppText>

          {/* Elegant Divider Flourish */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
            <View style={[styles.diamondPoint, { backgroundColor: theme.sourceColor }]} />
            <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
          </View>

          {/* Clean English Wisdom Translation */}
          <AppText
            variant="bodyMedium"
            color={theme.englishColor}
            style={[styles.englishText, isPhonePreview && styles.englishTextPreview]}
          >
            "{hadith.english}"
          </AppText>

          {/* Source Citation */}
          <AppText
            variant="titleSmall"
            color={theme.sourceColor}
            style={[styles.sourceText, isPhonePreview && styles.sourceTextPreview]}
          >
            {hadith.source.toUpperCase()} {hadith.reference && `• ${hadith.reference}`}
          </AppText>
        </View>

        {/* Subtle Brand Watermark at Bottom */}
        <View style={styles.brandWatermark}>
          <AppText variant="caption" color={theme.sourceColor} style={styles.brandText}>
            SalahFirst
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
    top: '25%',
    alignSelf: 'center',
    opacity: 0.9,
  },
  watermarkPreview: {
    top: '20%',
  },
  manuscriptFrame: {
    flex: 1,
    borderWidth: 1.2,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  topOrnament: {
    paddingTop: SPACING.xs,
    opacity: 0.9,
  },
  typographyBody: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 48,
    textAlign: 'center',
    fontWeight: '700',
    paddingHorizontal: SPACING.sm,
  },
  arabicTextPreview: {
    fontSize: 18,
    lineHeight: 32,
    paddingHorizontal: 2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    gap: 8,
    marginVertical: SPACING.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.6,
  },
  diamondPoint: {
    width: 5,
    height: 5,
    transform: [{ rotate: '45deg' }],
  },
  englishText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.95,
    paddingHorizontal: SPACING.xs,
  },
  englishTextPreview: {
    fontSize: 11,
    lineHeight: 16,
    paddingHorizontal: 0,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 4,
  },
  sourceTextPreview: {
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
  },
  brandWatermark: {
    paddingBottom: SPACING.xs,
    opacity: 0.4,
  },
  brandText: {
    letterSpacing: 3,
    fontWeight: '800',
    fontSize: 9,
    textTransform: 'uppercase',
  },
});
