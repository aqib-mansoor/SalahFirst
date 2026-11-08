import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { AppContainer, AppButton } from '@/components/common';
import { SetupAyahCarousel } from './SetupAyahCarousel';
import { SetupHeroText } from './SetupHeroText';
import { SetupLocationCard } from './SetupLocationCard';
import { SetupPrivacyBanner } from './SetupPrivacyBanner';
import { SetupCityModal } from './SetupCityModal';
import { PresetCity } from '@/data';
import { useTranslation } from '@/context/LocalizationContext';

export interface SetupScreenProps {
  onComplete?: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const {
    location,
    isLoading,
    permissionDenied,
    requestGpsLocation,
    openSettings,
    updateLocation,
  } = useDeviceLocation();

  const handleSelectCity = (city: PresetCity) => {
    updateLocation({
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      isGps: false,
    });
    setCityModalVisible(false);
  };

  const ChevronRight = (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={theme.colors.textInverse}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AppContainer
      scrollable
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Quran Ayah Carousel */}
        <SetupAyahCarousel />

        {/* Hero Title & Paragraph */}
        <SetupHeroText />

        {/* Location Setup Card */}
        <SetupLocationCard
          location={location}
          isLoading={isLoading}
          permissionDenied={permissionDenied}
          onRequestGps={requestGpsLocation}
          onOpenSettings={openSettings}
          onSelectCityManually={() => setCityModalVisible(true)}
        />

        {/* Offline Privacy Callout */}
        <SetupPrivacyBanner />

        {/* Primary Action Button */}
        <AppButton
          label={t('getStarted')}
          onPress={onComplete || (() => {})}
          variant="primary"
          size="lg"
          rightIcon={ChevronRight}
          style={styles.getStartedButton}
        />

        {/* Manual City Selector Modal */}
        <SetupCityModal
          visible={cityModalVisible}
          onClose={() => setCityModalVisible(false)}
          onSelect={handleSelectCity}
        />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  container: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  getStartedButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    minHeight: 56,
    marginTop: SPACING.xs,
  },
});
