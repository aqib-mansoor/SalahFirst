import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { useQiblaCompass } from '@/hooks/useQiblaCompass';
import { AppContainer } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { QiblaHeader } from './QiblaHeader';
import { QiblaDial3D } from './QiblaDial3D';
import { QiblaTelemetryCard } from './QiblaTelemetryCard';
import { QiblaCalibrationTip } from './QiblaCalibrationTip';

export interface QiblaScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ onNavigateTab }) => {
  const { location } = useDeviceLocation();
  const lat = location?.latitude ?? 24.8607;
  const lng = location?.longitude ?? 67.0011;

  const {
    heading,
    qiblaBearing,
    distanceKm,
    cardinal,
    relativePointerAngle,
    isAligned,
    hasSensor,
    needsCalibration,
  } = useQiblaCompass(lat, lng);

  return (
    <AppContainer edges={['top']}>
      <View style={styles.screenWrapper}>
        <QiblaHeader
          cityName={location?.city || 'Current Location'}
          country={location?.country || ''}
          qiblaBearing={qiblaBearing}
          cardinal={cardinal}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <QiblaTelemetryCard
            heading={heading}
            qiblaBearing={qiblaBearing}
            relativePointerAngle={relativePointerAngle}
            distanceKm={distanceKm}
            cardinal={cardinal}
            isAligned={isAligned}
          />

          <QiblaDial3D
            heading={heading}
            relativePointerAngle={relativePointerAngle}
            isAligned={isAligned}
          />

          <QiblaCalibrationTip
            hasSensor={hasSensor}
            needsCalibration={needsCalibration}
          />
        </ScrollView>

        <HomeBottomNav
          activeTab="qibla"
          onTabChange={onNavigateTab}
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
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
    alignItems: 'center',
  },
});
