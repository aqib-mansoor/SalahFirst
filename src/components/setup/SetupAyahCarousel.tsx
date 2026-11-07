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

  // Animation values for smooth cross-fade transition
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
        return prev; // Let transitionTo update the active index
      });
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  const currentAyah: QuranAyah = SETUP_QURAN_AYAT[activeIndex];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.bannerGreen }]}>
      <IslamicWatermark size={220} opacity={0.16} style={styles.watermark} />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={[styles.badgePill, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="caption" color={theme.colors.accent} style={styles.badgeText}>
            SALAHFIRST SETUP
          </AppText>
        </View>

        <AppText variant="caption" color={theme.colors.textMuted} style={styles.stepText}>
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
        <AppText
          variant="ayahArabic"
          color={theme.colors.bannerGreenText}
          align="right"
          style={styles.arabicText}
        >
          {currentAyah.arabic}
        </AppText>

        <AppText
          variant="bodySmall"
          color={theme.colors.accentLight}
          align="right"
          style={styles.urduText}
        >
          {currentAyah.urdu}
        </AppText>

        <AppText
          variant="bodyMedium"
          color={theme.colors.textMuted}
          style={styles.englishText}
        >
          "{currentAyah.english}"
        </AppText>

        <AppText
          variant="caption"
          color={theme.colors.accentLight}
          align="right"
          style={styles.referenceText}
        >
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
                  backgroundColor: isActive ? theme.colors.accent : theme.colors.textSubtle,
                  width: isActive ? 20 : 6,
                  opacity: isActive ? 1 : 0.4,
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
    minHeight: 190,
    justifyContent: 'space-between',
  },
  watermark: {
    top: -20,
    right: -50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgePill: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepText: {
    fontWeight: '600',
  },
  contentSection: {
    gap: SPACING.xs + 2,
    marginVertical: SPACING.xs,
  },
  arabicText: {
    marginBottom: SPACING.xs,
  },
  urduText: {
    opacity: 0.95,
    lineHeight: 22,
  },
  englishText: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  referenceText: {
    opacity: 0.8,
    marginTop: 2,
    fontSize: 11,
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
