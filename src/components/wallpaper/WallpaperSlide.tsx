import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Circle, G } from 'react-native-svg';
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

const WallpaperSlideComponent: React.FC<WallpaperSlideProps> = ({
  theme,
  hadith,
  width,
  height,
  isPhonePreview = false,
}) => {
  // Proportional dynamic safe zones to fit all screen sizes flawlessly
  const topSafeZone = Math.round(height * (isPhonePreview ? 0.24 : 0.26));
  const bottomSafeZone = Math.round(height * (isPhonePreview ? 0.16 : 0.18));

  // Dynamic responsive font sizes based on device canvas width
  const arabicFontSize = isPhonePreview
    ? Math.min(Math.max(Math.round(width * 0.07), 16), 22)
    : Math.min(Math.max(Math.round(width * 0.075), 24), 36);

  const arabicLineHeight = Math.round(arabicFontSize * 1.7);

  const englishFontSize = isPhonePreview
    ? Math.min(Math.max(Math.round(width * 0.04), 10), 12)
    : Math.min(Math.max(Math.round(width * 0.042), 14), 17);

  const englishLineHeight = Math.round(englishFontSize * 1.55);

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
      {/* Background Sacred Geometric Watermark (Ultra-Faint & Non-Intrusive) */}
      <View style={styles.watermarkContainer} pointerEvents="none">
        <Svg
          width={isPhonePreview ? Math.round(width * 0.8) : Math.round(width * 0.7)}
          height={isPhonePreview ? Math.round(width * 0.8) : Math.round(width * 0.7)}
          viewBox="0 0 260 260"
        >
          <G transform="translate(130, 130)">
            <Circle r={105} stroke={theme.watermarkColor} strokeWidth="1" fill="none" opacity={0.6} />
            <Circle r={60} stroke={theme.watermarkColor} strokeWidth="0.8" fill="none" opacity={0.5} />
            <Rect x="-72" y="-72" width="144" height="144" stroke={theme.watermarkColor} strokeWidth="1" fill="none" opacity={0.7} />
            <Rect x="-72" y="-72" width="144" height="144" stroke={theme.watermarkColor} strokeWidth="1" fill="none" transform="rotate(45)" opacity={0.7} />
          </G>
        </Svg>
      </View>

      {/* Pure Borderless Canvas with Proportional Safe Zones */}
      <View style={styles.contentCanvas}>
        {/* Top Clock Space (Safe Breathing Room for Native Lockscreen Clock) */}
        <View style={{ height: topSafeZone }} />

        {/* Central Fluid Sacred Typography (Zero Boxes, Zero Borders, Zero Icons) */}
        <View style={[styles.typographyZone, { paddingHorizontal: isPhonePreview ? SPACING.md : SPACING.xl }]}>
          {/* Majestic Arabic Calligraphy */}
          <AppText
            variant="arabicMotto"
            color={theme.arabicColor}
            style={[
              styles.arabicText,
              {
                fontSize: arabicFontSize,
                lineHeight: arabicLineHeight,
              },
            ]}
          >
            {hadith.arabic}
          </AppText>

          {/* Clean English Wisdom Translation */}
          <AppText
            variant="bodyMedium"
            color={theme.englishColor}
            style={[
              styles.englishText,
              {
                fontSize: englishFontSize,
                lineHeight: englishLineHeight,
              },
            ]}
          >
            "{hadith.english}"
          </AppText>

          {/* Authenticated Source Citation */}
          <AppText
            variant="titleSmall"
            color={theme.sourceColor}
            style={[
              styles.sourceCitation,
              {
                fontSize: isPhonePreview ? 9 : 11,
              },
            ]}
          >
            {hadith.source.toUpperCase()} {hadith.reference ? `• ${hadith.reference}` : ''}
          </AppText>
        </View>

        {/* Bottom Safe Zone with Discreet Lockscreen Signature */}
        <View style={[styles.bottomZone, { height: bottomSafeZone }]}>
          <AppText
            variant="caption"
            color={theme.sourceColor}
            style={styles.brandSignature}
          >
            SALAHFIRST
          </AppText>
        </View>
      </View>
    </View>
  );
};

export const WallpaperSlide = memo(WallpaperSlideComponent);

const styles = StyleSheet.create({
  slideContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    opacity: 0.85,
  },
  contentCanvas: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typographyZone: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    flexShrink: 1,
  },
  arabicText: {
    textAlign: 'center',
    fontWeight: '700',
  },
  englishText: {
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.95,
  },
  sourceCitation: {
    fontWeight: '800',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.9,
  },
  bottomZone: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: SPACING.md,
  },
  brandSignature: {
    letterSpacing: 3.5,
    fontWeight: '800',
    fontSize: 9,
    textTransform: 'uppercase',
    opacity: 0.35,
  },
});
