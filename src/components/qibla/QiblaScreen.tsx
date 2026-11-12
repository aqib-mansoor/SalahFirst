import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, QIBLA_DIAL_THEMES, QiblaDialStyleId } from '@/constants/theme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { useQiblaCompass } from '@/hooks/useQiblaCompass';
import { AppContainer } from '@/components/common';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { LocationBottomSheet } from '@/components/prayerTimes';
import { PresetCity } from '@/data';
import { storage } from '@/utils/storage';
import { useTranslation } from '@/context/LocalizationContext';
import { QiblaHeader } from './QiblaHeader';
import { QiblaMapBanner } from './QiblaMapBanner';
import { QiblaDial3D } from './QiblaDial3D';
import { QiblaStylePicker } from './QiblaStylePicker';
import { QiblaTelemetryCard } from './QiblaTelemetryCard';
import { QiblaCalibrationTip } from './QiblaCalibrationTip';

const QIBLA_STYLE_STORAGE_KEY = '@salahfirst_qibla_style';

export interface QiblaScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
  isActive?: boolean;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ onNavigateTab, isActive = true }) => {
  const { location, updateLocation, requestGpsLocation } = useDeviceLocation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [dialStyle, setDialStyle] = useState<QiblaDialStyleId>('classic');

  useEffect(() => {
    storage.get<QiblaDialStyleId | null>(QIBLA_STYLE_STORAGE_KEY, null).then((saved) => {
      if (saved && QIBLA_DIAL_THEMES[saved]) {
        setDialStyle(saved);
      }
    });
  }, []);

  const handleSelectStyle = (styleId: QiblaDialStyleId) => {
    setDialStyle(styleId);
    storage.set(QIBLA_STYLE_STORAGE_KEY, styleId);
  };

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
  } = useQiblaCompass(location?.latitude, location?.longitude, isActive);

  const activeDialTheme = QIBLA_DIAL_THEMES[dialStyle] || QIBLA_DIAL_THEMES.classic;

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
        {/* Clean, Spacious Flow Header with City & Change Action */}
        <QiblaHeader
          cityName={location?.city || t('detectingLocation')}
          country={location?.country || ''}
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
          {/* Geodesic Trajectory Map Banner & Kaaba Apex Marker */}
          <QiblaMapBanner
            qiblaBearing={qiblaBearing}
            distanceKm={distanceKm}
            isAligned={isAligned}
            dialTheme={activeDialTheme}
          />

          {/* Central Multi-Style Compass Dial */}
          <QiblaDial3D
            heading={heading}
            qiblaBearing={qiblaBearing}
            relativePointerAngle={relativePointerAngle}
            isAligned={isAligned}
            turnDirection={turnDirection}
            turnDegrees={turnDegrees}
            dialTheme={activeDialTheme}
          />

          {/* Interactive 4-Style Compass Theme Picker Dock */}
          <QiblaStylePicker
            selectedStyle={dialStyle}
            onSelectStyle={handleSelectStyle}
          />

          {/* Unified 3-Metric Telemetry Track (Heading, Qibla Bearing, Distance) */}
          <QiblaTelemetryCard
            heading={heading}
            qiblaBearing={qiblaBearing}
            distanceKm={distanceKm}
            cardinal={cardinal}
          />

          {/* Calibration Alert (Renders ONLY if interference is actively detected) */}
          <QiblaCalibrationTip
            hasSensor={hasSensor}
            needsCalibration={needsCalibration}
          />
        </ScrollView>

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
