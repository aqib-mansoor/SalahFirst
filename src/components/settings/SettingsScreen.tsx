import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useThemeState } from '@/hooks/useTheme';
import { useTranslation } from '@/context/LocalizationContext';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker, notifyTrackerPreferencesChanged } from '@/hooks/usePrayerTracker';
import { useHijriDate } from '@/hooks/useHijriDate';
import { AppContainer } from '@/components/common';
import { LocationBottomSheet } from '@/components/prayerTimes/LocationBottomSheet';
import { SettingsHeader } from './SettingsHeader';
import { PrayerSettingsGroup } from './PrayerSettingsGroup';
import { AppearanceSettingsGroup } from './AppearanceSettingsGroup';
import { InspirationSettingsGroup } from './InspirationSettingsGroup';
import { ReengagementSettingsGroup } from './ReengagementSettingsGroup';
import { GeneralSettingsGroup } from './GeneralSettingsGroup';
import { PresetCity } from '@/data';
import { CalculationMethodName, JuristicMethod } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { setCalculationMethod, setJuristicMethod } from '@/store/slices/prayerSlice';
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
  onOpenPermissionsHub?: () => void;
}

const CALC_LABELS: Record<CalculationMethodName, string> = {
  Karachi: 'University of Islamic Sciences, Karachi',
  UmmAlQura: 'Umm al-Qura University, Makkah',
  Dubai: 'Dubai (UAE)',
  MuslimWorldLeague: 'Muslim World League',
  Egyptian: 'Egyptian General Authority',
  NorthAmerica: 'ISNA (North America)',
  MoonsightingCommittee: 'Moonsighting Committee Worldwide',
  Kuwait: 'State of Kuwait',
  Qatar: 'Qatar Ministry of Awqaf',
  Singapore: 'MUIS Singapore',
  Tehran: 'University of Tehran',
  Turkey: 'Diyanet, Turkey',
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenAzanPrefs,
  onOpenFocusConfig,
  onOpenPrivacyPolicy,
  onOpenTerms,
}) => {
  const { theme, themeMode, setThemeMode } = useThemeState();
  const { location, updateLocation, requestGpsLocation } = useDeviceLocation();
  const { calcMethod, juristic } = usePrayerTracker(location);
  const { adjustment: hijriAdjustment, updateAdjustment: handleUpdateHijriAdjustment } = useHijriDate(location?.country);
  const { language, setLanguage } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [inspirationEnabled, setInspirationEnabled] = useState(true);
  const [reengagementEnabled, setReengagementEnabled] = useState(true);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
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
        timezone: location?.timezone,
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

  const handleCycleCalcMethod = () => {
    const methods: CalculationMethodName[] = [
      'Karachi',
      'UmmAlQura',
      'Dubai',
      'MuslimWorldLeague',
      'Egyptian',
      'NorthAmerica',
      'MoonsightingCommittee',
      'Kuwait',
      'Qatar',
      'Singapore',
      'Tehran',
      'Turkey',
    ];
    const currentIndex = methods.indexOf(calcMethod);
    const nextMethod = methods[(currentIndex + 1) % methods.length];
    dispatch(setCalculationMethod(nextMethod));
    notifyTrackerPreferencesChanged();
  };

  const handleToggleLanguage = () => {
    if (language === 'en') setLanguage('ur');
    else if (language === 'ur') setLanguage('ar');
    else setLanguage('en');
  };

  const languageLabel =
    language === 'ur'
      ? 'اردو (Urdu)'
      : language === 'ar'
      ? 'العربية (Arabic)'
      : 'English';

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
            cityName={location?.city || 'Select City'}
            country={location?.country || ''}
            juristicMethod={juristic}
            calculationMethodName={CALC_LABELS[calcMethod] || calcMethod}
            hijriAdjustment={hijriAdjustment}
            onUpdateHijriAdjustment={handleUpdateHijriAdjustment}
            onOpenLocation={() => setSheetVisible(true)}
            onOpenAzanPrefs={onOpenAzanPrefs}
            onOpenFocusConfig={onOpenFocusConfig}
            onToggleJuristic={handleToggleJuristic}
            onCycleCalculationMethod={handleCycleCalcMethod}
          />

          <AppearanceSettingsGroup
            themeMode={themeMode}
            onSelectThemeMode={setThemeMode}
            languageLabel={languageLabel}
            onToggleLanguage={handleToggleLanguage}
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
          />
        </ScrollView>

        <LocationBottomSheet
          visible={sheetVisible}
          currentCityName={location?.city || 'Select City'}
          isGps={location?.isGps}
          onClose={() => setSheetVisible(false)}
          onSelectCity={handleSelectCity}
          onUseGps={requestGpsLocation}
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
