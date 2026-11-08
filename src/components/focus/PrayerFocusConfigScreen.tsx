import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppText, AppButton, ScreenHeader } from '@/components/common';
import { FocusPrayerSelector, FocusPrayerSelection } from './FocusPrayerSelector';
import { FocusCongregationDelayCard } from './FocusCongregationDelayCard';
import { FocusDurationCard } from './FocusDurationCard';
import { FocusDistractionCard } from './FocusDistractionCard';
import { FocusSettingsCard } from './FocusSettingsCard';
import { FocusDuration } from '@/types';
import { useTranslation } from '@/context/LocalizationContext';
import {
  PrayerFocusOffsets,
  DEFAULT_FOCUS_OFFSETS,
  loadFocusOffsets,
  saveFocusOffsets,
} from '@/utils/prayerFocusOffsets';

export interface PrayerFocusConfigScreenProps {
  initialPrayer?: string;
  prayerTimesMap?: Record<string, string>;
  rawPrayerDates?: Record<string, Date>;
  onBack: () => void;
  onBeginFocus: (duration: FocusDuration, prayerName: string) => void;
}

export const PrayerFocusConfigScreen: React.FC<PrayerFocusConfigScreenProps> = ({
  initialPrayer = 'Fajr',
  prayerTimesMap,
  rawPrayerDates,
  onBack,
  onBeginFocus,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [selectedPrayer, setSelectedPrayer] = useState<FocusPrayerSelection>(
    (initialPrayer as FocusPrayerSelection) || 'Fajr'
  );
  const [offsets, setOffsets] = useState<PrayerFocusOffsets>(DEFAULT_FOCUS_OFFSETS);
  const [duration, setDuration] = useState<FocusDuration>(15);
  const [blockSocial, setBlockSocial] = useState(true);
  const [blockShortVideos, setBlockShortVideos] = useState(true);
  const [blockGames, setBlockGames] = useState(false);
  const [blockNews, setBlockNews] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [playAzan, setPlayAzan] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadFocusOffsets().then(setOffsets);
  }, []);

  const currentPrayerKey =
    selectedPrayer === 'All' ? 'dhuhr' : (selectedPrayer.toLowerCase() as keyof PrayerFocusOffsets);
  const currentDelay = offsets[currentPrayerKey] ?? 20;
  const targetAzan = prayerTimesMap && selectedPrayer !== 'All' ? prayerTimesMap[currentPrayerKey] : undefined;
  const targetRawDate = rawPrayerDates && selectedPrayer !== 'All' ? rawPrayerDates[currentPrayerKey] : undefined;

  const handleUpdateDelay = async (mins: number) => {
    let updated: PrayerFocusOffsets;
    if (selectedPrayer === 'All') {
      updated = { fajr: mins, dhuhr: mins, asr: mins, maghrib: mins, isha: mins };
    } else {
      updated = { ...offsets, [currentPrayerKey]: mins };
    }
    setOffsets(updated);
    await saveFocusOffsets(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveUniversal = async () => {
    await saveFocusOffsets(offsets);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const effectivePrayer = selectedPrayer === 'All' ? (initialPrayer !== 'All' ? initialPrayer : 'Fajr') : selectedPrayer;

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.screenContainer}
    >
      <View style={styles.screenContainer}>
        <ScreenHeader
          title={t('timeToReconnect') as string}
          subtitle={t('focusSub') as string}
          onBack={onBack}
          backAccessibilityLabel="Back to Home"
        />

        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* 1. Prayer Selector */}
          <FocusPrayerSelector
            selectedPrayer={selectedPrayer}
            targetAzanTime={targetAzan}
            onSelectPrayer={setSelectedPrayer}
          />

          {/* 2. Congregation Delay Offset Card */}
          <FocusCongregationDelayCard
            prayerName={selectedPrayer}
            selectedDelayMinutes={currentDelay}
            rawAzanDate={targetRawDate}
            onSelectDelay={handleUpdateDelay}
          />

          {/* 3. Duration Card */}
          <FocusDurationCard selectedDuration={duration} onSelectDuration={setDuration} />

          {/* 4. Distraction Shield Card */}
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

          {/* 5. Automation Settings */}
          <FocusSettingsCard
            autoStartOnAzan={autoStart}
            playAzanBefore={playAzan}
            onToggleAutoStart={() => setAutoStart((p) => !p)}
            onTogglePlayAzan={() => setPlayAzan((p) => !p)}
          />
        </ScrollView>

        {/* Docked Floating Footer with Phone Navbar Safe Area */}
        <View
          style={[
            styles.dockedFooter,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {selectedPrayer === 'All' ? (
            <View style={styles.actionColumn}>
              <AppButton
                label={isSaved ? '✓ Universal Settings Saved' : 'Save Focus Preferences'}
                onPress={handleSaveUniversal}
                size="lg"
                style={[styles.beginButton, { backgroundColor: isSaved ? theme.colors.mintTint : theme.colors.primary }]}
              />
              <Pressable
                onPress={() => onBeginFocus(duration, effectivePrayer)}
                hitSlop={8}
                style={styles.secondaryLink}
              >
                <AppText variant="bodySmall" color={theme.colors.primary} style={styles.secondaryText}>
                  Begin Focus Now ({effectivePrayer}) ›
                </AppText>
              </Pressable>
            </View>
          ) : (
            <AppButton
              label={`Begin ${selectedPrayer} Focus (${duration} min)`}
              onPress={() => onBeginFocus(duration, selectedPrayer)}
              size="lg"
              style={[styles.beginButton, { backgroundColor: theme.colors.primary }]}
            />
          )}
        </View>
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
  },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xs, paddingBottom: SPACING.xl, gap: SPACING.md },
  dockedFooter: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm + 2, borderTopWidth: 1 },
  actionColumn: { gap: SPACING.sm, alignItems: 'center' },
  beginButton: { width: '100%', borderRadius: RADIUS.lg, minHeight: 52 },
  secondaryLink: { paddingVertical: 6, paddingHorizontal: SPACING.md },
  secondaryText: { fontWeight: '700', fontSize: 13 },
});
