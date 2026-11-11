import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppButton, ScreenHeader } from '@/components/common';
import { FocusPrayerScheduleCard } from './FocusPrayerScheduleCard';
import { FocusDistractionCard } from './FocusDistractionCard';
import { FocusSettingsCard } from './FocusSettingsCard';
import { FocusDuration } from '@/types';
import { FormattedPrayerTimes } from '@/utils/prayerTimes';
import { useTranslation } from '@/context/LocalizationContext';
import {
  PrayerFocusOffsets,
  PrayerFocusDurations,
  DEFAULT_FOCUS_OFFSETS,
  DEFAULT_FOCUS_DURATIONS,
  loadFocusOffsets,
  saveFocusOffsets,
  loadFocusDurations,
  saveFocusDurations,
  loadFocusPreferences,
  saveFocusPreferences,
} from '@/utils/prayerFocusOffsets';

export interface PrayerFocusConfigScreenProps {
  initialPrayer?: string;
  prayerTimesMap?: Record<string, string> | FormattedPrayerTimes;
  rawPrayerDates?: Record<string, Date>;
  onBack: () => void;
  onBeginFocus?: (duration: FocusDuration, prayerName: string) => void;
}

export const PrayerFocusConfigScreen: React.FC<PrayerFocusConfigScreenProps> = ({
  rawPrayerDates,
  onBack,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [offsets, setOffsets] = useState<PrayerFocusOffsets>(DEFAULT_FOCUS_OFFSETS);
  const [durations, setDurations] = useState<PrayerFocusDurations>(DEFAULT_FOCUS_DURATIONS);
  const [blockSocial, setBlockSocial] = useState(true);
  const [blockShortVideos, setBlockShortVideos] = useState(true);
  const [blockGames, setBlockGames] = useState(false);
  const [blockNews, setBlockNews] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [playAzan, setPlayAzan] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      loadFocusOffsets(),
      loadFocusDurations(),
      loadFocusPreferences(),
    ]).then(([loadedOffsets, loadedDurations, loadedPrefs]) => {
      setOffsets(loadedOffsets);
      setDurations(loadedDurations);
      setAutoStart(loadedPrefs.autoStartOnAzan);
      setPlayAzan(loadedPrefs.playAzanBefore);
      setBlockSocial(loadedPrefs.blockSocial);
      setBlockShortVideos(loadedPrefs.blockShortVideos);
      setBlockGames(loadedPrefs.blockGames);
      setBlockNews(loadedPrefs.blockNews);
    });
  }, []);

  const handleUpdateDelay = (prayer: keyof PrayerFocusOffsets, mins: number) => {
    setOffsets((prev) => ({ ...prev, [prayer]: mins }));
  };

  const handleUpdateDuration = (prayer: keyof PrayerFocusDurations, mins: FocusDuration) => {
    setDurations((prev) => ({ ...prev, [prayer]: mins }));
  };

  const handleSaveAndReturn = async () => {
    setIsSaving(true);
    await Promise.all([
      saveFocusOffsets(offsets),
      saveFocusDurations(durations),
      saveFocusPreferences({
        autoStartOnAzan: autoStart,
        defaultDuration: durations.fajr || 15,
        playAzanBefore: playAzan,
        blockSocial,
        blockShortVideos,
        blockGames,
        blockNews,
      }),
    ]);
    setIsSaving(false);
    onBack();
  };

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.screenContainer}
    >
      <View style={styles.screenContainer}>
        <ScreenHeader
          title={(t('timeToReconnect') as string) || 'Prayer Focus'}
          subtitle={(t('focusSub') as string) || 'Configure your peaceful prayer sanctuary'}
          onBack={onBack}
          backAccessibilityLabel="Back to Home"
        />

        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <FocusPrayerScheduleCard
            offsets={offsets}
            durations={durations}
            rawPrayerDates={rawPrayerDates}
            onUpdateDelay={handleUpdateDelay}
            onUpdateDuration={handleUpdateDuration}
          />

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

          <FocusSettingsCard
            autoStartOnAzan={autoStart}
            playAzanBefore={playAzan}
            onToggleAutoStart={() => setAutoStart((p) => !p)}
            onTogglePlayAzan={() => setPlayAzan((p) => !p)}
          />
        </ScrollView>

        <View
          style={[
            styles.dockedFooter,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}
        >
          <AppButton
            label={(t('saveChanges') as string) || 'Save Changes'}
            onPress={handleSaveAndReturn}
            size="lg"
            loading={isSaving}
            disabled={isSaving}
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          />
        </View>
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  scrollWrapper: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  dockedFooter: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm + 4,
    borderTopWidth: 1,
  },
  saveButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    minHeight: 52,
  },
});
