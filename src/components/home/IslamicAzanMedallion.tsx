import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { RADIUS, SPACING } from '@/constants/theme';

export interface IslamicAzanMedallionProps {
  prayerName: string;
  azanTimeFormatted: string;
}

const PRAYER_ARABIC_NAMES: Record<string, string> = {
  fajr: 'الفَجْر',
  sunrise: 'الشُّرُوق',
  shurooq: 'الشُّرُوق',
  dhuhr: 'الظُّهْر',
  jumuah: 'الجُمُعَة',
  asr: 'العَصْر',
  maghrib: 'المَغْرِب',
  isha: 'العِشَاء',
  qiyam: 'القِيَام',
  tahajjud: 'التَّهَجُّد',
};

export const IslamicAzanMedallion: React.FC<IslamicAzanMedallionProps> = ({
  prayerName,
  azanTimeFormatted,
}) => {
  const theme = useTheme();

  const normalizedKey = (prayerName || '').toLowerCase().trim();
  const arabicText = PRAYER_ARABIC_NAMES[normalizedKey] || prayerName;

  return (
    <View style={styles.medallionWrapper}>
      {/* Decorative Islamic Hairline Geometry Frame */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 94 82">
          {/* Subtle Outer Rosette Border */}
          <Rect
            x={2}
            y={2}
            width={90}
            height={78}
            rx={16}
            stroke={theme.colors.accent}
            strokeWidth={1}
            strokeDasharray="4 2"
            opacity={0.3}
            fill="none"
          />
        </Svg>
      </View>

      {/* Medallion Core Container */}
      <View
        style={[
          styles.innerCard,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.28)',
            borderColor: 'rgba(247, 207, 87, 0.45)',
          },
        ]}
      >
        {/* Sacred Arabic Calligraphy Script */}
        <AppText
          color={theme.colors.accent}
          style={styles.arabicScript}
          numberOfLines={1}
        >
          {arabicText}
        </AppText>

        {/* Clean Azan Time Pill */}
        <View
          style={[
            styles.azanPill,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderColor: 'rgba(247, 207, 87, 0.3)',
            },
          ]}
        >
          {/* Chime Bell Icon */}
          <Svg width={11} height={11} viewBox="0 0 24 24" fill={theme.colors.accent}>
            <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
          </Svg>

          <AppText
            variant="caption"
            color={theme.colors.textOnPrimary}
            style={styles.azanTimeText}
            numberOfLines={1}
          >
            {azanTimeFormatted}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  medallionWrapper: {
    width: 96,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerCard: {
    width: 90,
    height: 78,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs + 2,
    gap: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  arabicScript: {
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  azanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 0.8,
  },
  azanTimeText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

