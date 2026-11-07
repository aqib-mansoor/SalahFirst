import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { AppContainer, AppText } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { PrayerTimesHeader } from './PrayerTimesHeader';
import { PrayerTimesLocationCard } from './PrayerTimesLocationCard';
import { SunriseCard } from './SunriseCard';
import { PrayerTimeRow } from './PrayerTimeRow';
import { LocationBottomSheet } from './LocationBottomSheet';
import { AzanPrefsScreen } from './AzanPrefsScreen';
import { PresetCity } from '@/data';

export interface PrayerTimesScreenProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: HomeTab) => void;
}

const ARABIC_NAMES: Record<string, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({
  onNavigateHome,
  onNavigateTab,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<HomeTab>('prayers');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showAzanPrefs, setShowAzanPrefs] = useState(false);

  const { location, updateLocation, needsCitySelection, requestGpsLocation } = useDeviceLocation();
  const { prayerData, prayersList } = usePrayerTracker(location);
  const { alerts, cyclePrayerMode } = usePrayerAlerts();

  useEffect(() => {
    if (needsCitySelection && !location) {
      setSheetVisible(true);
    }
  }, [needsCitySelection, location]);

  if (showAzanPrefs) {
    return <AzanPrefsScreen onBack={() => setShowAzanPrefs(false)} />;
  }

  const handleTabChange = (tab: HomeTab) => {
    setActiveTab(tab);
    if (tab === 'home' && onNavigateHome) {
      onNavigateHome();
    } else if (onNavigateTab) {
      onNavigateTab(tab);
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

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <PrayerTimesHeader onOpenAzanPrefs={() => setShowAzanPrefs(true)} />

          {/* Location Selector Card */}
          <PrayerTimesLocationCard
            cityName={location?.city || 'Detecting Location...'}
            country={location?.country || ''}
            onOpenLocationSheet={() => setSheetVisible(true)}
          />

          {/* Sunrise Card */}
          <SunriseCard time={prayerData.sunrise} />

          {/* Prayer Time Rows */}
          <View style={styles.prayerList}>
            {prayersList.map((p) => {
              const key = p.name.toLowerCase() as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
              return (
                <PrayerTimeRow
                  key={p.name}
                  name={p.name}
                  arabicName={ARABIC_NAMES[p.name] || ''}
                  time={p.time}
                  notification={alerts[key]}
                  isNext={p.isNext}
                  remainingTimeText={p.remainingTimeText}
                  onCycleNotification={() => cyclePrayerMode(key)}
                />
              );
            })}
          </View>

          {/* Configure Audio Footer Button */}
          <Pressable
            onPress={() => setShowAzanPrefs(true)}
            style={({ pressed }) => [
              styles.configCard,
              {
                backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.configText}>
              Configure Full Azan Audio & Pre-Prayer Reminders
            </AppText>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke={theme.colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        </ScrollView>

        {/* Bottom Nav */}
        <HomeBottomNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Location Bottom Sheet */}
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
    paddingBottom: 24,
  },
  prayerList: {
    marginVertical: SPACING.xs,
  },
  configCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  configText: {
    flex: 1,
    fontWeight: '700',
    fontSize: 13,
  },
});
