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
import { LocationBottomSheet } from '@/components/prayerTimes/LocationBottomSheet';
import { LanguageBottomSheet } from './LanguageBottomSheet';
import { CalculationMethodBottomSheet } from './CalculationMethodBottomSheet';
import { BackupRestoreModal } from './BackupRestoreModal';
import { SettingsHeader } from './SettingsHeader';
import { PrayerSettingsGroup } from './PrayerSettingsGroup';
import { AppearanceSettingsGroup } from './AppearanceSettingsGroup';
import { InspirationSettingsGroup } from './InspirationSettingsGroup';
import { ReengagementSettingsGroup } from './ReengagementSettingsGroup';
import { GeneralSettingsGroup } from './GeneralSettingsGroup';
import { PresetCity } from '@/data';
import { CalculationMethodName, JuristicMethod, TimeFormat } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCalculationMethod, setJuristicMethod } from '@/store/slices/prayerSlice';
import { setTimeFormat } from '@/store/slices/preferencesSlice';
import {
  getInspirationConfig,
  saveInspirationConfig,
  scheduleDailyInspirationNotification,
} from '@/utils/inspirationScheduler';
import {
  getReengagementConfig,
  saveReengagementConfig,
} from '@/utils/reengagementScheduler';

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
  const { location, updateLocation, requestGpsLocation } = useDeviceLocation();
  const { calcMethod, juristic } = usePrayerTracker(location);
  const { alerts } = usePrayerAlerts();
  const { currentReciter } = useAzanAudio();
  const { adjustment: hijriAdjustment, updateAdjustment: handleUpdateHijriAdjustment } = useHijriDate(location?.country);
  const { language, t } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);
  const [calcMethodSheetVisible, setCalcMethodSheetVisible] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [inspirationEnabled, setInspirationEnabled] = useState(true);
  const [reengagementEnabled, setReengagementEnabled] = useState(true);
  const dispatch = useAppDispatch();
  const timeFormat = useAppSelector((state) => state.preferences.timeFormat);

  useEffect(() => {
    getInspirationConfig().then((cfg) => setInspirationEnabled(cfg.enabled));
    getReengagementConfig().then((cfg) => setReengagementEnabled(cfg.enabled));
  }, []);

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

  const handleSelectCity = (city: PresetCity) => {
    updateLocation({
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      isGps: false,
    });
  };

  const handleToggleJuristic = () => {
    const nextJuristic: JuristicMethod = juristic === 'Hanafi' ? 'Standard' : 'Hanafi';
    dispatch(setJuristicMethod(nextJuristic));
    notifyTrackerPreferencesChanged();
  };

  const handleSelectCalcMethod = (method: CalculationMethodName) => {
    dispatch(setCalculationMethod(method));
    notifyTrackerPreferencesChanged();
  };

  const languageLabel =
    language === 'ur'
      ? 'اردو (Urdu)'
      : language === 'ar'
      ? 'العربية (Arabic)'
      : 'English';

  const reciterName =
    currentReciter === 'madinah'
      ? t('reciterMadinah')
      : currentReciter === 'alAqsa'
      ? t('reciterAlAqsa')
      : t('reciterMakkah');
  const reminderLabel =
    alerts.reminderOffset === 'off'
      ? t('off')
      : alerts.reminderOffset === '10m'
      ? t('tenMinBefore')
      : alerts.reminderOffset === '30m'
      ? t('thirtyMinBefore')
      : t('fifteenMinBefore');
  const azanSummaryText = `${reciterName} • ${reminderLabel}`;

  return (
    <AppContainer
      edges={['top', 'left', 'right', 'bottom']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        <SettingsHeader onBack={onBack} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <PrayerSettingsGroup
            cityName={location?.city || t('selectCity')}
            country={location?.country || ''}
            juristicMethod={juristic}
            calculationMethodName={t(CALC_LABEL_KEYS[calcMethod] || 'calcMethodKarachi')}
            hijriAdjustment={hijriAdjustment}
            azanSummaryText={azanSummaryText}
            onUpdateHijriAdjustment={handleUpdateHijriAdjustment}
            onOpenLocation={() => setSheetVisible(true)}
            onOpenAzanPrefs={onOpenAzanPrefs}
            onOpenFocusConfig={onOpenFocusConfig}
            onToggleJuristic={handleToggleJuristic}
            onCycleCalculationMethod={() => setCalcMethodSheetVisible(true)}
          />

          <AppearanceSettingsGroup
            themeMode={themeMode}
            onSelectThemeMode={setThemeMode}
            timeFormat={timeFormat}
            onSelectTimeFormat={(tf: TimeFormat) => {
              dispatch(setTimeFormat(tf));
              notifyTrackerPreferencesChanged();
            }}
            languageLabel={languageLabel}
            onOpenLanguageSheet={() => setLanguageSheetVisible(true)}
          />

          <InspirationSettingsGroup
            enabled={inspirationEnabled}
            onToggleEnabled={handleToggleInspiration}
          />

          <ReengagementSettingsGroup
            enabled={reengagementEnabled}
            onToggleEnabled={handleToggleReengagement}
          />

          <GeneralSettingsGroup
            onOpenPrivacyPolicy={onOpenPrivacyPolicy}
            onOpenTerms={onOpenTerms}
            onOpenChangelog={onOpenChangelog}
            onOpenBackupRestore={() => setBackupModalVisible(true)}
          />
        </ScrollView>

        <LocationBottomSheet
          visible={sheetVisible}
          currentCityName={location?.city || t('selectCity')}
          isGps={location?.isGps}
          onClose={() => setSheetVisible(false)}
          onSelectCity={handleSelectCity}
          onUseGps={requestGpsLocation}
        />

        <CalculationMethodBottomSheet
          visible={calcMethodSheetVisible}
          selectedMethod={calcMethod}
          onSelectMethod={handleSelectCalcMethod}
          onClose={() => setCalcMethodSheetVisible(false)}
        />

        <LanguageBottomSheet
          visible={languageSheetVisible}
          onClose={() => setLanguageSheetVisible(false)}
        />

        <BackupRestoreModal
          visible={backupModalVisible}
          onClose={() => setBackupModalVisible(false)}
        />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
});
