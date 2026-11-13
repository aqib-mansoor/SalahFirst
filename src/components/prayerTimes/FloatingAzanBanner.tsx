import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas, PrayerTimeIcon } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface FloatingAzanBannerProps {
  visible: boolean;
  prayerName: string | null;
  onStop: () => void;
}

export const FloatingAzanBanner: React.FC<FloatingAzanBannerProps> = ({
  visible,
  prayerName,
  onStop,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible, pulseAnim]);

  if (!visible || !prayerName) return null;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.banner,
          {
            backgroundColor: theme.colors.primaryHero,
            borderColor: 'rgba(243, 196, 64, 0.45)',
          },
        ]}
      >
        <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.14} />

        {/* Left: Prayer Icon + Title + Live Equalizer Subtitle */}
        <View style={styles.leftGroup}>
          <View
            style={[
              styles.iconOrb,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderColor: 'rgba(243, 196, 64, 0.35)',
              },
            ]}
          >
            <PrayerTimeIcon prayer={prayerName} size={19} />
          </View>

          <View style={styles.textColumn}>
            <View style={styles.titleRow}>
              <AppText variant="titleSmall" color={theme.colors.textOnPrimary} style={styles.prayerTitle}>
                {`${prayerName} ${t('azan') || 'Azan'}`}
              </AppText>
              <Animated.View
                style={[
                  styles.liveDot,
                  { backgroundColor: theme.colors.accent, opacity: pulseAnim },
                ]}
              />
            </View>
            <AppText variant="caption" color={theme.colors.accentLight} style={styles.recitingSubtitle}>
              {t('azanReciting') || 'Hayya \'ala-s-Salah • Reciting now'}
            </AppText>
          </View>
        </View>

        {/* Right: Sleek Gold/Translucent Silence Pill */}
        <Pressable
          onPress={onStop}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('stopAzan') || 'Silence Azan'}
          style={({ pressed }) => [
            styles.stopBtn,
            {
              backgroundColor: pressed ? theme.colors.accent : 'rgba(243, 196, 64, 0.18)',
              borderColor: theme.colors.accent,
            },
          ]}
        >
          <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 6h12v12H6z"
              fill={theme.colors.accentLight}
            />
          </Svg>
          <AppText
            variant="caption"
            color={theme.colors.accentLight}
            style={styles.stopText}
          >
            {t('stopAzan') || 'Silence'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: 2,
    zIndex: 50,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    gap: SPACING.sm,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    zIndex: 2,
  },
  iconOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prayerTitle: {
    fontWeight: '800',
    fontSize: 13.5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  recitingSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.92,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    zIndex: 2,
  },
  stopText: {
    fontWeight: '800',
    fontSize: 11.5,
  },
});
