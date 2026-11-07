import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppText, AppButton } from '@/components/common';
import { FocusDurationCard } from './FocusDurationCard';
import { FocusDistractionCard } from './FocusDistractionCard';
import { FocusSettingsCard } from './FocusSettingsCard';
import { FocusDuration } from '@/types';

const PRAYER_OPTIONS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export interface PrayerFocusConfigScreenProps {
  initialPrayer?: string;
  prayerTimesMap?: Record<string, string>;
  onBack: () => void;
  onBeginFocus: (duration: FocusDuration, prayerName: string) => void;
}

export const PrayerFocusConfigScreen: React.FC<PrayerFocusConfigScreenProps> = ({
  initialPrayer = 'Asr',
  prayerTimesMap,
  onBack,
  onBeginFocus,
}) => {
  const theme = useTheme();
  const [selectedPrayer, setSelectedPrayer] = useState<string>(initialPrayer);
  const [duration, setDuration] = useState<FocusDuration>(15);
  const [blockSocial, setBlockSocial] = useState(true);
  const [blockShortVideos, setBlockShortVideos] = useState(true);
  const [blockGames, setBlockGames] = useState(false);
  const [blockNews, setBlockNews] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [playAzan, setPlayAzan] = useState(true);

  const CrescentMoonIcon = (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={PALETTE.gold}>
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
  );

  const targetTime = prayerTimesMap ? prayerTimesMap[selectedPrayer.toLowerCase()] : undefined;

  return (
    <AppContainer
      edges={['top', 'left', 'right', 'bottom']}
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
          style={[styles.backBtn, { borderColor: theme.colors.border }]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={theme.colors.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        <View style={[styles.headerBadge, { backgroundColor: theme.colors.mintTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.headerBadgeText}>
            PRAYER FOCUS MODE
          </AppText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Title & Tagline */}
        <View style={styles.titleSection}>
          <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
            Time to reconnect.
          </AppText>
          <AppText variant="bodyLarge" color={theme.colors.textMuted} style={styles.subtitle}>
            Put distractions aside and dedicate this time purely to Salah.
          </AppText>
        </View>

        {/* Target Prayer Selection Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.prayerHeaderRow}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.cardTitle}>
              Select Prayer for Focus
            </AppText>
            {targetTime && (
              <AppText variant="caption" color={theme.colors.accent} style={styles.timeTag}>
                Azan: {targetTime}
              </AppText>
            )}
          </View>

          <View style={styles.prayerPillsRow}>
            {PRAYER_OPTIONS.map((name) => {
              const isSelected = selectedPrayer.toLowerCase() === name.toLowerCase();
              return (
                <Pressable
                  key={name}
                  onPress={() => setSelectedPrayer(name)}
                  accessibilityRole="button"
                  accessibilityLabel={`${name} prayer`}
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    styles.prayerPill,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceElevated,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.textInverse : theme.colors.text}
                    style={styles.prayerPillText}
                  >
                    {name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 1. Duration Card */}
        <FocusDurationCard
          selectedDuration={duration}
          onSelectDuration={setDuration}
        />

        {/* 2. Distractions Card */}
        <FocusDistractionCard
          blockSocial={blockSocial}
          blockShortVideos={blockShortVideos}
          blockGames={blockGames}
          blockNews={blockNews}
          onToggleSocial={() => setBlockSocial((p) => !p)}
          onToggleShortVideos={() => setBlockShortVideos((p) => !p)}
          onToggleGames={() => setBlockGames((p) => !p)}
          onToggleNews={() => setBlockNews((p) => !p)}
        />

        {/* 3. Settings Card */}
        <FocusSettingsCard
          autoStartOnAzan={autoStart}
          playAzanBefore={playAzan}
          onToggleAutoStart={() => setAutoStart((p) => !p)}
          onTogglePlayAzan={() => setPlayAzan((p) => !p)}
        />

        {/* Begin Focus Button */}
        <AppButton
          label={`Begin ${selectedPrayer} Focus (${duration} min)`}
          leftIcon={CrescentMoonIcon}
          onPress={() => onBeginFocus(duration, selectedPrayer)}
          size="lg"
          style={[styles.beginButton, { backgroundColor: theme.colors.primary }]}
        />
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  headerBadgeText: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  titleSection: {
    gap: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    lineHeight: 22,
  },
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  prayerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '700',
  },
  timeTag: {
    fontWeight: '700',
  },
  prayerPillsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  prayerPill: {
    flex: 1,
    paddingVertical: SPACING.xs + 3,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  prayerPillText: {
    fontWeight: '700',
    fontSize: 11,
  },
  beginButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    minHeight: 56,
    marginTop: SPACING.xs,
  },
});
