import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SETUP_QURAN_AYAT, QuranAyah } from '@/data';
import { SPACING, RADIUS, TYPOGRAPHY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';

export const SetupAyahCarousel: React.FC = () => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = SETUP_QURAN_AYAT.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  const currentAyah: QuranAyah = SETUP_QURAN_AYAT[activeIndex];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.bannerGreen }]}>
      {/* Background Watermark */}
      <IslamicWatermark
        size={220}
        opacity={0.16}
        style={styles.watermark}
      />

      {/* Top Header Row */}
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

      {/* Content Section: Arabic Ayah -> Urdu -> English */}
      <View style={styles.contentSection}>
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
      </View>

      {/* Carousel Pagination Dots */}
      <View style={styles.dotsRow}>
        {SETUP_QURAN_AYAT.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <Pressable
              key={item.id}
              onPress={() => setActiveIndex(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? theme.colors.accent : theme.colors.textSubtle,
                  width: isActive ? 18 : 6,
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
    minHeight: 180,
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
    marginBottom: SPACING.md,
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
    opacity: 0.9,
    lineHeight: 22,
  },
  englishText: {
    fontStyle: 'italic',
    lineHeight: 20,
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
