import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { AppText } from '@/components/common';
import { RADIUS } from '@/constants/theme';

export type WallpaperPreviewMode = 'clean' | 'lockscreen' | 'homescreen';

export interface WallpaperPhoneOverlayProps {
  mode: WallpaperPreviewMode;
  isDarkTheme: boolean;
  width: number;
  height: number;
}

export const WallpaperPhoneOverlay: React.FC<WallpaperPhoneOverlayProps> = ({
  mode,
  isDarkTheme,
}) => {
  if (mode === 'clean') return null;

  const textColor = isDarkTheme ? '#FFFFFF' : '#0A261B';
  const subTextColor = isDarkTheme ? 'rgba(255, 255, 255, 0.72)' : 'rgba(10, 38, 27, 0.72)';
  const bubbleBg = isDarkTheme ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.55)';
  const iconStroke = isDarkTheme ? '#FFFFFF' : '#0A261B';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {mode === 'lockscreen' && (
        <View style={styles.lockscreenContainer}>
          {/* Top Lock Icon & Digital Clock */}
          <View style={styles.topClockZone}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={styles.lockIcon}>
              <Rect x="5" y="11" width="14" height="10" rx="2" stroke={textColor} strokeWidth="2" />
              <Path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke={textColor} strokeWidth="2" />
            </Svg>

            <AppText variant="timerDisplay" color={textColor} style={styles.clockDigits}>
              09:41
            </AppText>
            <AppText variant="caption" color={subTextColor} style={styles.dateLabel}>
              Sunday, 15 Sha'ban
            </AppText>
          </View>

          {/* Bottom Lockscreen Shortcuts */}
          <View style={styles.bottomShortcutsRow}>
            {/* Flashlight Shortcut */}
            <View style={[styles.shortcutCircle, { backgroundColor: bubbleBg }]}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L16 11V20H8V11L6 6V3H18V6Z" stroke={iconStroke} strokeWidth="2" strokeLinejoin="round" />
                <Path d="M12 11V14" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>

            {/* Camera Shortcut */}
            <View style={[styles.shortcutCircle, { backgroundColor: bubbleBg }]}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke={iconStroke} strokeWidth="1.8" />
                <Circle cx="12" cy="13" r="4" stroke={iconStroke} strokeWidth="1.8" />
              </Svg>
            </View>
          </View>

          {/* Home Bar */}
          <View style={[styles.homeIndicator, { backgroundColor: textColor }]} />
        </View>
      )}

      {mode === 'homescreen' && (
        <View style={styles.homescreenContainer}>
          {/* Top Mini Clock */}
          <View style={styles.miniStatusRow}>
            <AppText variant="caption" color={textColor} style={styles.miniTime}>
              09:41
            </AppText>
          </View>

          {/* Bottom App Dock Mockup */}
          <View style={styles.appDockWrapper}>
            <View style={[styles.appDockGrid, { backgroundColor: bubbleBg }]}>
              {['Salah', 'Quran', 'Dhikr', 'Settings'].map((app, idx) => (
                <View key={idx} style={styles.appIconItem}>
                  <View style={[styles.appIconSquare, { backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.22)' : 'rgba(10,38,27,0.15)' }]} />
                  <AppText variant="caption" color={subTextColor} style={styles.appLabel}>
                    {app}
                  </AppText>
                </View>
              ))}
            </View>
            <View style={[styles.homeIndicator, { backgroundColor: textColor }]} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  lockscreenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  topClockZone: {
    alignItems: 'center',
    paddingTop: 4,
  },
  lockIcon: {
    marginBottom: 2,
    opacity: 0.85,
  },
  clockDigits: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: -2,
  },
  bottomShortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  shortcutCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 60,
    height: 3.5,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    opacity: 0.5,
    marginBottom: 2,
  },
  homescreenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 8,
  },
  miniStatusRow: {
    alignItems: 'flex-start',
    paddingLeft: 6,
  },
  miniTime: {
    fontSize: 9,
    fontWeight: '700',
  },
  appDockWrapper: {
    gap: 8,
  },
  appDockGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 18,
  },
  appIconItem: {
    alignItems: 'center',
    gap: 2,
  },
  appIconSquare: {
    width: 26,
    height: 26,
    borderRadius: 8,
  },
  appLabel: {
    fontSize: 8,
    fontWeight: '600',
  },
});
