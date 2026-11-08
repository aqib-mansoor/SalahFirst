import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { SETUP_QURAN_AYAT, QuranAyah } from '@/data';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';

export const SetupAyahCarousel: React.FC = () => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = SETUP_QURAN_AYAT.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const transitionTo = (newIndex: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setActiveIndex(newIndex);
      slideAnim.setValue(6);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % total;
        transitionTo(next);
        return prev;
      });
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  const currentAyah: QuranAyah = SETUP_QURAN_AYAT[activeIndex];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.bannerGreen }]}>
      {/* Islamic Geometry Canvas Watermarks */}
      <IslamicWatermark
        size={240}
        opacity={0.22}
        color={PALETTE.emeraldWatermark}
        style={styles.watermarkTopRight}
      />
      <IslamicWatermark
        size={220}
        opacity={0.16}
        color={PALETTE.goldLight}
        style={styles.watermarkBottomLeft}
      />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.badgePill}>
          <AppText variant="caption" style={styles.badgeText}>
            SALAHFIRST SETUP
          </AppText>
        </View>

        <AppText variant="caption" style={styles.stepText}>
          Step 1 of 1
        </AppText>
      </View>

      {/* Animated Ayah Content */}
      <Animated.View
        style={[
          styles.contentSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <AppText variant="ayahArabic" style={styles.arabicText}>
          {currentAyah.arabic}
        </AppText>

        <AppText style={styles.urduText}>
          {currentAyah.urdu}
        </AppText>

        <AppText style={styles.englishText}>
          "{currentAyah.english}"
        </AppText>

        <AppText style={styles.referenceText}>
          — {currentAyah.reference}
        </AppText>
      </Animated.View>

      {/* Pagination Indicator Dots */}
      <View style={styles.dotsRow}>
        {SETUP_QURAN_AYAT.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <Pressable
              key={item.id}
              onPress={() => transitionTo(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? PALETTE.gold : 'rgba(255, 255, 255, 0.35)',
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
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 200,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(204, 161, 95, 0.28)',
    shadowColor: PALETTE.emeraldDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  watermarkTopRight: {
    top: -30,
    right: -40,
  },
  watermarkBottomLeft: {
    bottom: -40,
    left: -40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgePill: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(204, 161, 95, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(204, 161, 95, 0.45)',
  },
  badgeText: {
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
    color: '#FDE68A',
  },
  stepText: {
    fontWeight: '600',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  contentSection: {
    gap: SPACING.xs + 2,
    marginVertical: SPACING.xs,
  },
  arabicText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'right',
  },
  urduText: {
    color: '#FEF3C7',
    fontSize: 13.5,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'right',
  },
  englishText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  referenceText: {
    color: '#FDE68A',
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'right',
    opacity: 0.95,
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    marginTop: SPACING.md,
  },
  dot: {
    height: 5,
    borderRadius: RADIUS.full,
  },
});
