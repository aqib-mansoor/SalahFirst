import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { calculateQiblaBearing, getCardinalDirection } from '@/utils/qiblaCalculations';

export interface HeroQiblaGlanceProps {
  latitude?: number;
  longitude?: number;
  sunriseTimeFormatted?: string;
  onPress?: () => void;
}

/**
 * HeroQiblaGlance
 * Standalone separate card for real-time Qibla bearing & Shurooq (Sunrise) timing.
 * Tappable to launch the full interactive Qibla Compass.
 */
export const HeroQiblaGlance: React.FC<HeroQiblaGlanceProps> = ({
  latitude,
  longitude,
  sunriseTimeFormatted,
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const qiblaData = useMemo(() => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return null;
    }
    const bearing = calculateQiblaBearing(latitude, longitude);
    const cardinal = getCardinalDirection(bearing);
    return { bearing, cardinal };
  }, [latitude, longitude]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Qibla direction: ${qiblaData ? `${qiblaData.bearing} degrees ${qiblaData.cardinal}` : 'Compass'}. Tap to open full Qibla.`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.colors.primaryHero },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Top Section: Qibla Bearing Glance */}
      <View style={styles.qiblaSection}>
        <View style={styles.headerRow}>
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={theme.colors.accent} strokeWidth="1.8" />
            <Path d="M12 2L15 12L12 9L9 12L12 2Z" fill={theme.colors.accent} />
            <Path d="M12 22L9 12L12 15L15 12L12 22Z" fill="rgba(255, 255, 255, 0.4)" />
          </Svg>
          <AppText
            variant="caption"
            color={theme.colors.accentLight}
            style={styles.sectionTitle}
            numberOfLines={1}
          >
            {t('navQibla').toUpperCase()}
          </AppText>
        </View>

        <View style={styles.bearingRow}>
          <AppText
            color={theme.colors.textOnPrimary}
            style={styles.bearingText}
            numberOfLines={1}
          >
            {qiblaData ? `${qiblaData.bearing}°` : '--°'}
          </AppText>
          {qiblaData?.cardinal ? (
            <AppText
              variant="caption"
              color={theme.colors.accent}
              style={styles.cardinalText}
              numberOfLines={1}
            >
              {qiblaData.cardinal}
            </AppText>
          ) : null}
        </View>
      </View>

      {/* Internal Divider */}
      <View style={styles.internalDivider} />

      {/* Bottom Section: Sunrise / Shurooq Timing */}
      <View style={styles.sunriseSection}>
        <View style={styles.headerRow}>
          <Svg width={13} height={13} viewBox="0 0 24 24" fill={theme.colors.accent}>
            <Circle cx="12" cy="12" r="5" />
            <Path
              d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke={theme.colors.accent}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </Svg>
          <AppText
            variant="caption"
            color="rgba(255, 255, 255, 0.75)"
            style={styles.sunriseLabel}
            numberOfLines={1}
          >
            {t('sunrise')}
          </AppText>
        </View>

        <AppText
          variant="bodySmall"
          color={theme.colors.textOnPrimary}
          style={styles.sunriseTimeText}
          numberOfLines={1}
        >
          {sunriseTimeFormatted || '--:--'}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0.85,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm + 3,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(247, 207, 87, 0.28)',
    shadowColor: '#075E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 5,
    minHeight: 128,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  qiblaSection: {
    gap: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bearingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    paddingLeft: 1,
  },
  bearingText: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  cardinalText: {
    fontSize: 11,
    fontWeight: '700',
  },
  internalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 4,
  },
  sunriseSection: {
    gap: 1,
  },
  sunriseLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  sunriseTimeText: {
    fontSize: 13,
    fontWeight: '700',
    paddingLeft: 1,
    fontVariant: ['tabular-nums'],
  },
});
