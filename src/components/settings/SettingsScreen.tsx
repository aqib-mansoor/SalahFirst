import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useThemeState } from '@/hooks/useTheme';
import { useTranslation, TranslationKey } from '@/context/LocalizationContext';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker, notifyTrackerPreferencesChanged } from '@/hooks/usePrayerTracker';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useAzanAudio } from '@/hooks/useAzanAudio';
import { useHijriDate } from '@/hooks/useHijriDate';
import { AppContainer } from '@/components/common';
import { SettingsHeader } from './SettingsHeader';
import { PrayerSettingsGroup } from './PrayerSettingsGroup';
import { AzanAlertsSettingsGroup } from './AzanAlertsSettingsGroup';
import { FocusSettingsGroup } from './FocusSettingsGroup';
import { SystemSettingsGroup } from './SystemSettingsGroup';
import { SettingsModalsHub } from './SettingsModalsHub';
import { PresetCity } from '@/data';
import { CalculationMethodName, JuristicMethod, FiqhName, TimeFormat, PrayerMinuteAdjustments } from '@/types';
import { getDefaultDelaysForFiqh } from '@/constants/fiqh';
import {
  saveFocusOffsets,
  loadAutoSilenceConfig,
  saveAutoSilenceConfig,
  DEFAULT_AUTO_SILENCE_CONFIG,
  AutoSilenceConfig,
} from '@/utils/prayerFocusOffsets';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCalculationMethod, setFiqh, setPrayerAdjustments } from '@/store/slices/prayerSlice';
import { setTimeFormat, setHapticFeedback } from '@/store/slices/preferencesSlice';
import { triggerHaptic } from '@/utils/haptics';
import { getInspirationConfig, saveInspirationConfig, scheduleDailyInspirationNotification } from '@/utils/inspirationScheduler';
import { getReengagementConfig, saveReengagementConfig } from '@/utils/reengagementScheduler';

export interface SettingsScreenProps {
  onBack: () => void;
  onOpenAzanPrefs: () => void;
  onOpenFocusConfig?: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onOpenChangelog?: () => void;
}

const CALC_LABEL_KEYS: Record<CalculationMethodName, TranslationKey> = {
  Karachi: 'calcMethodKarachi',
  UmmAlQura: 'calcMethodUmmAlQura',
  Dubai: 'calcMethodDubai',
  MuslimWorldLeague: 'calcMethodMuslimWorldLeague',
  Egyptian: 'calcMethodEgyptian',
  NorthAmerica: 'calcMethodNorthAmerica',
  MoonsightingCommittee: 'calcMethodMoonsightingCommittee',
  Kuwait: 'calcMethodKuwait',
  Qatar: 'calcMethodQatar',
  Singapore: 'calcMethodSingapore',
  Tehran: 'calcMethodTehran',
  Turkey: 'calcMethodTurkey',
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenAzanPrefs,
  onOpenFocusConfig,
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenChangelog,
}) => {
  const { theme, themeMode, setThemeMode } = useThemeState();
  const { location, updateLocation } = useDeviceLocation();
  const { prayerData, calcMethod, juristic, fiqh: reduxFiqh } = usePrayerTracker(location);
  const { alerts, setReminder, toggleExactAlarms } = usePrayerAlerts();
  const { currentReciter } = useAzanAudio();
  const { adjustment: hijriAdjustment, updateAdjustment: handleUpdateHijriAdjustment } = useHijriDate(location?.country);
  const { language, t } = useTranslation();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);
  const [calcMethodSheetVisible, setCalcMethodSheetVisible] = useState(false);
  const [fiqhSheetVisible, setFiqhSheetVisible] = useState(false);
  const [adjustmentsSheetVisible, setAdjustmentsSheetVisible] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [inspirationEnabled, setInspirationEnabled] = useState(true);
  const [reengagementEnabled, setReengagementEnabled] = useState(true);
  const [silenceConfig, setSilenceConfig] = useState<AutoSilenceConfig>(DEFAULT_AUTO_SILENCE_CONFIG);

  const dispatch = useAppDispatch();
  const timeFormat = useAppSelector((state) => state.preferences.timeFormat);
  const hapticFeedback = useAppSelector((state) => state.preferences.hapticFeedback);
  const prayerAdjustments = useAppSelector((state) => state.prayer.prayerAdjustments);

  useEffect(() => {
    getInspirationConfig().then((cfg) => setInspirationEnabled(cfg.enabled));
    getReengagementConfig().then((cfg) => setReengagementEnabled(cfg.enabled));
    loadAutoSilenceConfig().then((cfg) => setSilenceConfig(cfg));
  }, []);

  const handleToggleAutoSilenceMaster = async (enabled: boolean) => {
    const updated = { ...silenceConfig, enabled };
    setSilenceConfig(updated);
    await saveAutoSilenceConfig(updated);
  };

  const handleToggleAutoSilencePrayer = async (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    const updated = { ...silenceConfig, [prayer]: !silenceConfig[prayer] };
    setSilenceConfig(updated);
    await saveAutoSilenceConfig(updated);
  };

  const handleToggleReengagement = async (val: boolean) => {
    setReengagementEnabled(val);
    const cfg = await getReengagementConfig();
    await saveReengagementConfig({ ...cfg, enabled: val });
  };

  const handleToggleInspiration = async (val: boolean) => {
    setInspirationEnabled(val);
    const cfg = await getInspirationConfig();
    await saveInspirationConfig({ ...cfg, enabled: val });
    if (val) {
      await scheduleDailyInspirationNotification({
        latitude: location?.latitude,
        longitude: location?.longitude,
        timezone: location?.timezone,
        calculationMethod: calcMethod,
        juristicMethod: juristic,
        language,
      });
    }
  };

  const handleSelectFiqh = (selectedFiqh: FiqhName, applyRecommendedCalc: boolean) => {
    dispatch(setFiqh({ fiqh: selectedFiqh, applyRecommendedCalc }));
    saveFocusOffsets(getDefaultDelaysForFiqh(selectedFiqh));
    notifyTrackerPreferencesChanged();
  };

  const activeAdjustmentsCount = Object.values(prayerAdjustments).filter((v) => v !== 0).length;
  const adjustmentsSummaryText =
    activeAdjustmentsCount > 0
      ? t('activePrayerOffsetsCount', { count: activeAdjustmentsCount })
      : t('prayerTimeAdjustmentsSub');

  const languageLabel = language === 'ur' ? 'اردو (Urdu)' : language === 'ar' ? 'العربية (Arabic)' : 'English';
  const reciterLabelMap: Record<string, string> = {
    makkah: t('reciterMakkah'),
    madinah: t('reciterMadinah'),
    alAqsa: t('reciterAlAqsa'),
    alafasy: t('reciterAlafasy'),
    qatami: t('reciterQatami'),
  };
  const safeReciter = currentReciter === 'fajr' ? 'makkah' : currentReciter;
  const reciterName = reciterLabelMap[safeReciter] || t('reciterMakkah');

  return (
    <AppContainer edges={['top', 'left', 'right', 'bottom']} style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <SettingsHeader onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Pillar 1: Prayer Times & Calculation */}
          <PrayerSettingsGroup
            cityName={location?.city || t('selectCity')}
            country={location?.country || ''}
            juristicMethod={juristic}
            fiqh={reduxFiqh || (juristic as FiqhName)}
            calculationMethodName={t(CALC_LABEL_KEYS[calcMethod] || 'calcMethodKarachi')}
            hijriAdjustment={hijriAdjustment}
            adjustmentsSummaryText={adjustmentsSummaryText}
            onUpdateHijriAdjustment={handleUpdateHijriAdjustment}
            onOpenLocation={() => setSheetVisible(true)}
            onOpenPrayerAdjustments={() => setAdjustmentsSheetVisible(true)}
            onOpenFiqh={() => setFiqhSheetVisible(true)}
            onCycleCalculationMethod={() => setCalcMethodSheetVisible(true)}
          />

          {/* Pillar 2: Azan & Audio Alerts */}
          <AzanAlertsSettingsGroup
            reciterName={reciterName}
            reminderOffset={alerts.reminderOffset}
            onSelectReminderOffset={(offset) => setReminder(offset)}
            exactAlarmsEnabled={alerts.exactAlarmsEnabled !== false}
            onToggleExactAlarms={toggleExactAlarms}
            onOpenAzanPrefs={onOpenAzanPrefs}
          />

          {/* Pillar 3: Focus & Auto-Silence */}
          <FocusSettingsGroup
            autoSilenceEnabled={silenceConfig.enabled}
            onToggleAutoSilence={handleToggleAutoSilenceMaster}
            activePrayers={{
              fajr: silenceConfig.fajr,
              dhuhr: silenceConfig.dhuhr,
              asr: silenceConfig.asr,
              maghrib: silenceConfig.maghrib,
              isha: silenceConfig.isha,
            }}
            onTogglePrayer={handleToggleAutoSilencePrayer}
            onOpenFocusConfig={onOpenFocusConfig}
          />

          {/* Pillar 4: App & Preferences */}
          <SystemSettingsGroup
            themeMode={themeMode}
            onSelectThemeMode={setThemeMode}
            timeFormat={timeFormat}
            onSelectTimeFormat={(tf: TimeFormat) => {
              dispatch(setTimeFormat(tf));
              notifyTrackerPreferencesChanged();
            }}
            languageLabel={languageLabel}
            onOpenLanguageSheet={() => setLanguageSheetVisible(true)}
            hapticFeedback={hapticFeedback}
            onToggleHapticFeedback={(enabled: boolean) => {
              dispatch(setHapticFeedback(enabled));
              if (enabled) triggerHaptic('light');
            }}
            inspirationEnabled={inspirationEnabled}
            onToggleInspiration={handleToggleInspiration}
            reengagementEnabled={reengagementEnabled}
            onToggleReengagement={handleToggleReengagement}
            onOpenBackupRestore={() => setBackupModalVisible(true)}
            onOpenPrivacyPolicy={onOpenPrivacyPolicy}
            onOpenTerms={onOpenTerms}
            onOpenChangelog={onOpenChangelog}
          />
        </ScrollView>

        <SettingsModalsHub
          sheetVisible={sheetVisible}
          currentCityName={location?.city || t('selectCity')}
          onSelectCity={(city: PresetCity) => updateLocation({ city: city.name, country: city.country, latitude: city.latitude, longitude: city.longitude, isGps: false })}
          onCloseLocation={() => setSheetVisible(false)}
          calcMethodSheetVisible={calcMethodSheetVisible}
          calcMethod={calcMethod}
          onSelectCalcMethod={(method) => {
            dispatch(setCalculationMethod(method));
            notifyTrackerPreferencesChanged();
          }}
          onCloseCalcMethod={() => setCalcMethodSheetVisible(false)}
          fiqhSheetVisible={fiqhSheetVisible}
          selectedFiqh={reduxFiqh || (juristic as FiqhName) || 'Hanafi'}
          onSelectFiqh={handleSelectFiqh}
          onCloseFiqh={() => setFiqhSheetVisible(false)}
          languageSheetVisible={languageSheetVisible}
          onCloseLanguage={() => setLanguageSheetVisible(false)}
          backupModalVisible={backupModalVisible}
          onCloseBackup={() => setBackupModalVisible(false)}
          adjustmentsSheetVisible={adjustmentsSheetVisible}
          prayerAdjustments={prayerAdjustments}
          prayerData={prayerData}
          onUpdatePrayerAdjustments={(updated) => {
            dispatch(setPrayerAdjustments(updated));
            notifyTrackerPreferencesChanged();
          }}
          onCloseAdjustments={() => setAdjustmentsSheetVisible(false)}
        />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
});
