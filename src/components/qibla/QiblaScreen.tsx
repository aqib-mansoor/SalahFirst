import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '@/constants/theme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { useQiblaCompass } from '@/hooks/useQiblaCompass';
import { AppContainer } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { LocationBottomSheet } from '@/components/prayerTimes';
import { PresetCity } from '@/data';
import { useTranslation } from '@/context/LocalizationContext';
import { QiblaHeader } from './QiblaHeader';
import { QiblaDial3D } from './QiblaDial3D';
import { QiblaTelemetryCard } from './QiblaTelemetryCard';
import { QiblaCalibrationTip } from './QiblaCalibrationTip';

export interface QiblaScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ onNavigateTab }) => {
  const { location, updateLocation, requestGpsLocation } = useDeviceLocation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);

  const {
    heading,
    qiblaBearing,
    distanceKm,
    cardinal,
    relativePointerAngle,
    isAligned,
    turnDirection,
    turnDegrees,
    hasSensor,
    needsCalibration,
  } = useQiblaCompass(location?.latitude, location?.longitude);

  const handleSelectCity = (city: PresetCity) => {
    updateLocation({
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
      isGps: false,
    });
    setSheetVisible(false);
  };

  const handleUseGps = async () => {
    await requestGpsLocation();
    setSheetVisible(false);
  };

  return (
    <AppContainer edges={['top', 'left', 'right']}>
      <View style={styles.screenWrapper}>
        {/* Header with City and Qibla Bearing Badge */}
        <QiblaHeader
          cityName={location?.city || t('detectingLocation')}
          country={location?.country || ''}
          qiblaBearing={qiblaBearing}
          cardinal={cardinal}
          onChangeLocation={() => setSheetVisible(true)}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Dynamic Directional Guidance & 3-Metric Telemetry */}
          <QiblaTelemetryCard
            heading={heading}
            qiblaBearing={qiblaBearing}
            distanceKm={distanceKm}
            cardinal={cardinal}
            isAligned={isAligned}
            turnDirection={turnDirection}
            turnDegrees={turnDegrees}
          />

          {/* Central Compass Dial with Rub el Hizb and Kaaba Needle */}
          <QiblaDial3D
            heading={heading}
            relativePointerAngle={relativePointerAngle}
            isAligned={isAligned}
          />

          {/* Calibration Guidance & Sensor Status */}
          <QiblaCalibrationTip
            hasSensor={hasSensor}
            needsCalibration={needsCalibration}
          />
        </ScrollView>

        {/* Global Bottom Navigation */}
        <HomeBottomNav
          activeTab="qibla"
          onTabChange={onNavigateTab}
        />

        {/* Worldwide City Selector Bottom Sheet */}
        <LocationBottomSheet
          visible={sheetVisible}
          currentCityName={location?.city || t('selectCity')}
          isGps={location?.isGps}
          onClose={() => setSheetVisible(false)}
          onSelectCity={handleSelectCity}
          onUseGps={handleUseGps}
        />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.xs,
    gap: SPACING.md,
    alignItems: 'center',
  },
});
