import React, { useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { useQiblaCompass } from '@/hooks/useQiblaCompass';
import { AppContainer, CurvedHeaderContainer } from '@/components/common';
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

  const {
    heading,
    qiblaBearing,
    distanceKm,
    cardinal,
    relativePointerAngle,
    isAligned,
    hasSensor,
    needsCalibration,
  } = useQiblaCompass(location?.latitude, location?.longitude);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(64);

  return (
    <AppContainer edges={['top']}>
      <View style={styles.screenWrapper}>
        {/* Dynamic Curved Elevated Header on Scroll */}
        <CurvedHeaderContainer
          scrollY={scrollY}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && Math.abs(h - headerHeight) > 1) {
              setHeaderHeight(h);
            }
          }}
        >
          <QiblaHeader
            cityName={location?.city || 'Current Location'}
            country={location?.country || ''}
            qiblaBearing={qiblaBearing}
            cardinal={cardinal}
          />
        </CurvedHeaderContainer>

        <Animated.ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerHeight + SPACING.xs },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
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
        </Animated.ScrollView>

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
    paddingBottom: 100,
    gap: SPACING.md,
    alignItems: 'center',
  },
});
