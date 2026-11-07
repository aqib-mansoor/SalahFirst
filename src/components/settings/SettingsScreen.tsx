import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme, useThemeState } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
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

export interface SettingsScreenProps {
  onBack: () => void;
  onOpenAzanPrefs: () => void;
  onNavigateTab: (tab: HomeTab) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenAzanPrefs,
  onNavigateTab,
}) => {
  const { theme, themeMode, setThemeMode } = useThemeState();
  const { location, updateLocation } = useDeviceLocation();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [showWallpaper, setShowWallpaper] = useState(false);
  const [juristic, setJuristic] = useState<'Hanafi' | 'Standard'>('Hanafi');
  const [language, setLanguage] = useState<'English' | 'Urdu'>('English');

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

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'SalahFirst Privacy Policy',
      'SalahFirst is 100% offline and private. No user data, location history, or telemetry is ever collected, transmitted, or stored on external servers.'
    );
  };

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        {/* Header */}
        <SettingsHeader onBack={onBack} />

        {/* Scrollable Groups */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Prayer Settings */}
          <PrayerSettingsGroup
            cityName={location.city || 'Chakwal'}
            country={location.country || 'Pakistan'}
            juristicMethod={juristic}
            onOpenLocation={() => setSheetVisible(true)}
            onOpenAzanPrefs={onOpenAzanPrefs}
            onToggleJuristic={() =>
              setJuristic((p) => (p === 'Hanafi' ? 'Standard' : 'Hanafi'))
            }
          />

          {/* Appearance Settings */}
          <AppearanceSettingsGroup
            themeMode={themeMode}
            onSelectThemeMode={setThemeMode}
            onOpenWallpaperGallery={() => setShowWallpaper(true)}
          />

          {/* General & Local Storage */}
          <GeneralSettingsGroup
            language={language}
            onToggleLanguage={() =>
              setLanguage((p) => (p === 'English' ? 'Urdu' : 'English'))
            }
            onOpenPrivacyPolicy={handlePrivacyPolicy}
          />
        </ScrollView>

        {/* Bottom Nav */}
        <HomeBottomNav activeTab="home" onTabChange={onNavigateTab} />

        {/* Location Bottom Sheet */}
        <LocationBottomSheet
          visible={sheetVisible}
          currentCityName={location.city || 'Chakwal'}
          onClose={() => setSheetVisible(false)}
          onSelectCity={handleSelectCity}
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

