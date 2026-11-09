import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useHijriDate } from '@/hooks/useHijriDate';
import { AppContainer, AppText } from '@/components/common';
import { HomeTab } from '@/components/home/HomeBottomNav';
import {
  PrayerTimesHeader,
  PrayerTimesDateSwitcher,
  PrayerTimesLocationCard,
  SunMilestonesCard,
  NextTomorrowPrayerCard,
  NaflTimingsCard,
  PrayerTimeRow,
  LocationBottomSheet,
  AzanPrefsScreen,
} from '@/components/prayerTimes';
import {
  getPrayerTimes,
  formatRemainingTime,
  calculateDailyNaflSchedule,
  CALCULATION_METHOD_LABELS,
} from '@/utils/prayerTimes';
import { PresetCity } from '@/data';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrayerTimesScreenProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: HomeTab) => void;
}

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({
  onNavigateHome,
  onNavigateTab,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showAzanPrefs, setShowAzanPrefs] = useState(false);
  const [dateOffset, setDateOffset] = useState<number>(0);

  const { location, updateLocation, needsCitySelection, requestGpsLocation } = useDeviceLocation();
  const { prayerData, prayersList, juristic, calcMethod } = usePrayerTracker(location);
  const { alerts, cyclePrayerMode } = usePrayerAlerts();

  const viewedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return d;
  }, [dateOffset]);

  const isToday = dateOffset === 0;
  const { hijriDateFormatted } = useHijriDate(location?.country, viewedDate);

  // Compute viewed prayer times when navigating dates
  const activePrayerData = useMemo(() => {
    if (isToday) return prayerData;
    return getPrayerTimes(
      location?.latitude,
      location?.longitude,
      viewedDate,
      calcMethod,
      juristic,
      location?.timezone
    );
  }, [isToday, prayerData, location?.latitude, location?.longitude, location?.timezone, viewedDate, calcMethod, juristic]);

  // When today's Isha is reached, tomorrow's Fajr becomes next
  const isAfterTodayIsha = useMemo(() => {
    if (!isToday || !prayerData?.raw?.isha) return false;
    return Date.now() >= prayerData.raw.isha.getTime();
  }, [isToday, prayerData?.raw?.isha]);

  // Prayers list: live with real-time countdown when today, static schedule when other date
  const activePrayersList = useMemo(() => {
    if (isToday) {
      return isAfterTodayIsha
        ? prayersList.map((p) => (p.name === 'Fajr' ? { ...p, isNext: false, remainingTimeText: undefined } : p))
        : prayersList;
    }
    const names = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    return names.map((name) => ({
      name,
      time: (activePrayerData as any)[name.toLowerCase()] || '--:--',
      completed: false,
      isNext: false,
      isCurrent: false,
      hasStarted: false,
      remainingTimeText: undefined,
    }));
  }, [isToday, isAfterTodayIsha, prayersList, activePrayerData]);

  const naflSchedule = useMemo(() => {
    return calculateDailyNaflSchedule(activePrayerData.raw, undefined, location?.timezone);
  }, [activePrayerData.raw, location?.timezone]);

  useEffect(() => {
    if (needsCitySelection && !location) setSheetVisible(true);
  }, [needsCitySelection, location]);

  if (showAzanPrefs) return <AzanPrefsScreen onBack={() => setShowAzanPrefs(false)} />;

  const handleSelectCity = (c: PresetCity) => {
    updateLocation({ city: c.name, country: c.country, latitude: c.latitude, longitude: c.longitude, isGps: false });
  };

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        <PrayerTimesHeader
          countryName={location?.country}
          onOpenAzanPrefs={() => setShowAzanPrefs(true)}
        />

        <PrayerTimesDateSwitcher
          date={viewedDate}
          dateOffset={dateOffset}
          hijriDateFormatted={hijriDateFormatted}
          onPrevDay={() => setDateOffset((prev) => prev - 1)}
          onNextDay={() => setDateOffset((prev) => prev + 1)}
          onResetToday={() => setDateOffset(0)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <PrayerTimesLocationCard
            cityName={location?.city}
            country={location?.country || ''}
            methodName={CALCULATION_METHOD_LABELS[calcMethod]}
            juristicMethod={juristic}
            isGps={location?.isGps}
            onOpenLocationSheet={() => setSheetVisible(true)}
            onUseGps={requestGpsLocation}
          />

          <SunMilestonesCard
            sunriseTime={activePrayerData.sunrise}
            sunsetTime={activePrayerData.maghrib}
          />

          {isToday && isAfterTodayIsha && (
            <NextTomorrowPrayerCard
              prayerName={prayerData.nextPrayerName}
              timeFormatted={prayerData.nextPrayerTimeFormatted}
              remainingTimeText={formatRemainingTime(prayerData.nextPrayerDate)}
            />
          )}

          <View style={styles.prayerList}>
            {activePrayersList.map((p) => {
              const key = p.name.toLowerCase() as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
              return (
                <PrayerTimeRow
                  key={p.name}
                  name={p.name}
                  time={p.time}
                  notification={alerts[key]}
                  isNext={p.isNext}
                  isCurrent={p.isCurrent}
                  remainingTimeText={p.remainingTimeText}
                  onCycleNotification={() => cyclePrayerMode(key)}
                />
              );
            })}
          </View>

          <NaflTimingsCard
            tahajjudRange={naflSchedule.tahajjudRange}
            lastThirdRange={naflSchedule.lastThirdRange}
            ishraqRange={naflSchedule.ishraqRange}
            duhaRange={naflSchedule.duhaRange}
            zawalRange={naflSchedule.zawalRange}
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
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 100,
  },
  prayerList: {
    marginVertical: SPACING.xs,
  },
});

