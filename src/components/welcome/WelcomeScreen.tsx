import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { IslamicWatermark } from './IslamicWatermark';
import { WelcomeHeader } from './WelcomeHeader';
import { WelcomeBrand } from './WelcomeBrand';
import { WelcomeFooter } from './WelcomeFooter';

export interface WelcomeScreenProps {
  onContinue?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue = () => {},
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[styles.container, { backgroundColor: theme.colors.primaryHero }]}
    >
      <StatusBar style="light" />

      {/* Background Islamic Geometric Watermarks */}
      <IslamicWatermark
        size={340}
        opacity={0.25}
        color={theme.colors.watermark}
        style={styles.topRightWatermark}
      />
      <IslamicWatermark
        size={360}
        opacity={0.25}
        color={theme.colors.watermark}
        style={styles.bottomLeftWatermark}
      />

      {/* Screen Content */}
      <View style={styles.content}>
        <WelcomeHeader />

        <View style={styles.centerSection}>
          <WelcomeBrand />
        </View>

        <WelcomeFooter onContinue={onContinue} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightWatermark: {
    top: 20,
    right: -70,
  },
  bottomLeftWatermark: {
    bottom: 30,
    left: -90,
  },
});
