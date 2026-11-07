import React, { useState } from 'react';
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

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({
  onNavigateHome,
  onNavigateTab,
}) => {
  const theme = useTheme('light');
  const [activeTab, setActiveTab] = useState<HomeTab>('prayers');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showAzanPrefs, setShowAzanPrefs] = useState(false);

  const { location, updateLocation } = useDeviceLocation();
  const { prayerData } = usePrayerTracker(location);
  const { alerts, cyclePrayerMode } = usePrayerAlerts();

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

  const prayers = [
    {
      name: 'Fajr',
      arabicName: 'الفجر',
      time: prayerData.fajr,
      key: 'fajr' as const,
      isNext: false,
    },
    {
      name: 'Dhuhr',
      arabicName: 'الظهر',
      time: prayerData.dhuhr,
      key: 'dhuhr' as const,
      isNext: false,
    },
    {
      name: 'Asr',
      arabicName: 'العصر',
      time: prayerData.asr,
      key: 'asr' as const,
      isNext: false,
    },
    {
      name: 'Maghrib',
      arabicName: 'المغرب',
      time: prayerData.maghrib,
      key: 'maghrib' as const,
      isNext: true,
      remainingText: 'IN 1H 24M',
    },
    {
      name: 'Isha',
      arabicName: 'العشاء',
      time: prayerData.isha,
      key: 'isha' as const,
      isNext: false,
    },
  ];

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
            cityName={location.city || 'Chakwal'}
            country={location.country || 'Pakistan'}
            onOpenLocationSheet={() => setSheetVisible(true)}
          />

          {/* Sunrise Card */}
          <SunriseCard time={`${prayerData.sunrise} AM`} />

          {/* Prayer Time Rows */}
          <View style={styles.prayerList}>
            {prayers.map((p) => (
              <PrayerTimeRow
                key={p.name}
                name={p.name}
                arabicName={p.arabicName}
                time={p.time}
                notification={alerts[p.key]}
                isNext={p.isNext}
                remainingTimeText={p.remainingText}
                onCycleNotification={() => cyclePrayerMode(p.key)}
              />
            ))}
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

