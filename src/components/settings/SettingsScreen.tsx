import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useThemeState } from '@/hooks/useTheme';
import { useTranslation } from '@/context/LocalizationContext';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker, notifyTrackerPreferencesChanged } from '@/hooks/usePrayerTracker';
import { AppContainer } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { LocationBottomSheet } from '@/components/prayerTimes/LocationBottomSheet';
import { HadithWallpaperScreen } from '@/components/wallpaper';
import { VERIFIED_HADITHS } from '@/data/hadiths';
import { SettingsHeader } from './SettingsHeader';
import { PrayerSettingsGroup } from './PrayerSettingsGroup';
import { AppearanceSettingsGroup } from './AppearanceSettingsGroup';
import { GeneralSettingsGroup } from './GeneralSettingsGroup';
import { PresetCity } from '@/data';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { CalculationMethodName, JuristicMethod } from '@/types';
import { fetchAlAdhanTimings, comparePrayerTimings } from '@/utils/aladhanApi';

export interface SettingsScreenProps {
  onBack: () => void;
  onOpenAzanPrefs: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onNavigateTab: (tab: HomeTab) => void;
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
  onOpenPrivacyPolicy,
  onOpenTerms,
  onNavigateTab,
}) => {
  const { theme, themeMode, setThemeMode } = useThemeState();
  const { location, updateLocation, requestGpsLocation } = useDeviceLocation();
  const { prayerData, calcMethod, juristic } = usePrayerTracker(location);

  const { language, setLanguage } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showWallpaper, setShowWallpaper] = useState(false);

  if (showWallpaper) {
    return (
      <HadithWallpaperScreen
        hadith={VERIFIED_HADITHS[2]}
        onClose={() => setShowWallpaper(false)}
      />
    );
  }

  const handleSelectCity = (city: PresetCity) => {
    updateLocation({
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      isGps: false,
    });
  };

  const handleToggleJuristic = async () => {
    const nextJuristic: JuristicMethod = juristic === 'Hanafi' ? 'Standard' : 'Hanafi';
    await storage.set(APP_CONFIG.storageKeys.juristicMethod, nextJuristic);
    notifyTrackerPreferencesChanged();
  };

  const handleCycleCalcMethod = async () => {
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
    await storage.set(APP_CONFIG.storageKeys.calculationMethod, nextMethod);
    notifyTrackerPreferencesChanged();
  };

  const handleVerifyAlAdhan = async () => {
    if (!location?.latitude || !location?.longitude) {
      Alert.alert('Location Required', 'Please enable GPS or select a city before verifying.');
      return;
    }
    const res = await fetchAlAdhanTimings(
      location.latitude,
      location.longitude,
      new Date(),
      calcMethod,
      juristic
    );
    if (!res.success || !res.timings) {
      Alert.alert(
        'AlAdhan API Offline',
        res.error || 'Network unavailable. SalahFirst continues calculating locally 100% offline.'
      );
      return;
    }
    const diffs = comparePrayerTimings(
      {
        fajr: prayerData.fajr,
        sunrise: prayerData.sunrise,
        dhuhr: prayerData.dhuhr,
        asr: prayerData.asr,
        maghrib: prayerData.maghrib,
        isha: prayerData.isha,
      },
      res.timings
    );
    const summary = diffs
      .map(
        (d) =>
          `${d.prayer}: Local ${d.localTime} vs API ${d.apiTime} (${
            d.diffMinutes >= 0 ? '+' : ''
          }${d.diffMinutes}m)`
      )
      .join('\n');
    Alert.alert(
      `AlAdhan Comparison (${res.meta?.methodName || calcMethod})`,
      `Date: ${res.dateFormatted || 'Today'}\n\n${summary}`
    );
  };

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        <SettingsHeader onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <PrayerSettingsGroup
            cityName={location?.city || 'Detecting Location...'}
            country={location?.country || ''}
            juristicMethod={juristic}
            calculationMethodName={CALC_LABELS[calcMethod] || calcMethod}
            onOpenLocation={() => setSheetVisible(true)}
            onOpenAzanPrefs={onOpenAzanPrefs}
            onToggleJuristic={handleToggleJuristic}
            onCycleCalculationMethod={handleCycleCalcMethod}
            onVerifyAlAdhan={handleVerifyAlAdhan}
          />

          <AppearanceSettingsGroup
            themeMode={themeMode}
            onSelectThemeMode={setThemeMode}
            onOpenWallpaperGallery={() => setShowWallpaper(true)}
          />

          <GeneralSettingsGroup
            language={
              language === 'ur'
                ? 'اردو (Urdu)'
                : language === 'ar'
                ? 'العربية (Arabic)'
                : 'English'
            }
            onToggleLanguage={() => {
              if (language === 'en') setLanguage('ur');
              else if (language === 'ur') setLanguage('ar');
              else setLanguage('en');
            }}
            onOpenPrivacyPolicy={onOpenPrivacyPolicy}
            onOpenTerms={onOpenTerms}
          />
        </ScrollView>

        <HomeBottomNav activeTab="home" onTabChange={onNavigateTab} />

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
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
});
