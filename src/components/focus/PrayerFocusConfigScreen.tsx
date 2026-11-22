import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppButton, ScreenHeader } from '@/components/common';
import { FocusPrayerScheduleCard } from './FocusPrayerScheduleCard';
import { FocusAutoSilenceCard } from './FocusAutoSilenceCard';
import { FocusSettingsCard } from './FocusSettingsCard';
import { FocusDuration, FiqhName } from '@/types';
import { FormattedPrayerTimes } from '@/utils/prayerTimes';
import { useTranslation } from '@/context/LocalizationContext';
import { useAppSelector } from '@/store/hooks';
import { getDefaultDelaysForFiqh } from '@/constants/fiqh';
import {
  PrayerFocusOffsets,
  PrayerFocusDurations,
  AutoSilenceConfig,
  DEFAULT_FOCUS_OFFSETS,
  DEFAULT_FOCUS_DURATIONS,
  DEFAULT_AUTO_SILENCE_CONFIG,
  loadFocusOffsets,
  saveFocusOffsets,
  loadFocusDurations,
  saveFocusDurations,
  loadFocusPreferences,
  saveFocusPreferences,
  loadAutoSilenceConfig,
  saveAutoSilenceConfig,
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
  const activeFiqh = useAppSelector((state) => (state.prayer.fiqh || state.prayer.juristic || 'Hanafi') as FiqhName);

  const [offsets, setOffsets] = useState<PrayerFocusOffsets>(DEFAULT_FOCUS_OFFSETS);
  const [durations, setDurations] = useState<PrayerFocusDurations>(DEFAULT_FOCUS_DURATIONS);
  const [silenceConfig, setSilenceConfig] = useState<AutoSilenceConfig>(DEFAULT_AUTO_SILENCE_CONFIG);
  const [autoStart, setAutoStart] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      loadFocusOffsets(activeFiqh),
      loadFocusDurations(),
      loadFocusPreferences(),
      loadAutoSilenceConfig(),
    ]).then(([loadedOffsets, loadedDurations, loadedPrefs, loadedSilence]) => {
      setOffsets(loadedOffsets);
      setDurations(loadedDurations);
      setAutoStart(loadedPrefs.autoStartOnAzan);
      setSilenceConfig(loadedSilence);
    });
  }, [activeFiqh]);

  const handleUpdateDelay = (prayer: keyof PrayerFocusOffsets, mins: number) => {
    setOffsets((prev) => ({ ...prev, [prayer]: mins }));
  };

  const handleUpdateDuration = (prayer: keyof PrayerFocusDurations, mins: FocusDuration) => {
    setDurations((prev) => ({ ...prev, [prayer]: mins }));
  };

  const handleResetToFiqhDefaults = () => {
    const defaults = getDefaultDelaysForFiqh(activeFiqh);
    setOffsets(defaults);
  };

  const handleToggleSilenceMaster = (enabled: boolean) => {
    setSilenceConfig((prev) => ({ ...prev, enabled }));
  };

  const handleToggleSilencePrayer = (prayer: keyof Omit<AutoSilenceConfig, 'enabled'>) => {
    setSilenceConfig((prev) => ({ ...prev, [prayer]: !prev[prayer] }));
  };

  const handleSaveAndReturn = async () => {
    setIsSaving(true);
    const existingPrefs = await loadFocusPreferences();
    await Promise.all([
      saveFocusOffsets(offsets),
      saveFocusDurations(durations),
      saveAutoSilenceConfig(silenceConfig),
      saveFocusPreferences({
        ...existingPrefs,
        autoStartOnAzan: autoStart,
        defaultDuration: durations.fajr || 15,
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
            fiqhName={activeFiqh}
            onUpdateDelay={handleUpdateDelay}
            onUpdateDuration={handleUpdateDuration}
            onResetDefaults={handleResetToFiqhDefaults}
          />

          <FocusAutoSilenceCard
            config={silenceConfig}
            onToggleMaster={handleToggleSilenceMaster}
            onTogglePrayer={handleToggleSilencePrayer}
          />

          <FocusSettingsCard
            autoStartOnAzan={autoStart}
            onToggleAutoStart={() => setAutoStart((p) => !p)}
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
