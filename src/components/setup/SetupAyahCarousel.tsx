import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { SETUP_QURAN_AYAT, QuranAyah } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
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
    <View style={[styles.card, { backgroundColor: theme.colors.primaryHero, borderColor: theme.colors.borderGold }]}>
      {/* Islamic Geometry Canvas Watermarks */}
      <IslamicWatermark
        size={240}
        opacity={0.22}
        color={theme.colors.watermark}
        style={styles.watermarkTopRight}
      />
      <IslamicWatermark
        size={220}
        opacity={0.16}
        color={theme.colors.accentLight}
        style={styles.watermarkBottomLeft}
      />

      {/* Animated Ayah Content */}
      <Animated.View
        style={[
          styles.contentSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <AppText variant="ayahArabic" color={theme.colors.textOnPrimary} style={styles.arabicText}>
          {currentAyah.arabic}
        </AppText>

        <AppText color={theme.colors.accentLight} style={styles.urduText}>
          {currentAyah.urdu}
        </AppText>

        <AppText color={theme.colors.textOnPrimary} style={styles.englishText}>
          "{currentAyah.english}"
        </AppText>

        <AppText color={theme.colors.accent} style={styles.referenceText}>
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
                  backgroundColor: isActive ? theme.colors.accent : 'rgba(255, 255, 255, 0.35)',
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowColor: '#000000',
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
  contentSection: {
    gap: SPACING.xs + 3,
    marginVertical: SPACING.xs,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'right',
  },
  urduText: {
    fontSize: 13.5,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'right',
  },
  englishText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  referenceText: {
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
