import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Circle, G, Polygon, Line, Rect } from 'react-native-svg';
import {
  RADIUS,
  SPACING,
  QIBLA_DIAL_STYLE_LIST,
  QiblaDialStyleId,
  QiblaDialThemeSpec,
} from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface QiblaStylePickerProps {
  selectedStyle: QiblaDialStyleId;
  onSelectStyle: (styleId: QiblaDialStyleId) => void;
}

const MiniDialThumb: React.FC<{ spec: QiblaDialThemeSpec }> = ({ spec }) => (
  <Svg width={46} height={46} viewBox="0 0 46 46">
    <Circle
      cx="23"
      cy="23"
      r="20.5"
      fill={spec.dialBg}
      stroke={spec.dialBorder}
      strokeWidth="2"
    />

    {spec.id === 'emerald' && (
      /* Type 3 Preview: Open Center HUD + Orbiting Kaaba Dot */
      <>
        <Circle cx="23" cy="23" r="10" stroke={spec.innerRing} strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
        <Rect x="19.5" y="6" width="7" height="7" rx="1.5" fill="#141716" stroke={spec.northTick} strokeWidth="1" />
        <Line x1="23" y1="13" x2="23" y2="18" stroke={spec.northTick} strokeWidth="1.5" />
      </>
    )}

    {spec.id === 'rose' && (
      /* Type 2 Preview: 8-Point Nautical Star Compass Rose */
      <>
        <Polygon
          points="23,7 26,20 39,23 26,26 23,39 20,26 7,23 20,20"
          fill="#78716C"
        />
        <Polygon
          points="23,11 25,21 35,23 25,25 23,35 21,25 11,23 21,21"
          transform="rotate(45 23 23)"
          fill="#A8A29E"
        />
        <Polygon points="23,7 26,20 20,20" fill={spec.needleNorthLeft} />
        <Circle cx="23" cy="23" r="2.5" fill={spec.hubBg} stroke={spec.hubBorder} strokeWidth="1.2" />
      </>
    )}

    {spec.id === 'classic' && (
      /* Type 1 Preview: Classic 3D Bipyramid Emerald Needle */
      <>
        <Line x1="23" y1="4" x2="23" y2="7" stroke={spec.northTick} strokeWidth="2" strokeLinecap="round" />
        <Polygon points="23,8 27,23 19,23" fill={spec.needleNorthLeft} />
        <Polygon points="23,38 27,23 19,23" fill={spec.needleSouthLeft} />
        <Circle cx="23" cy="23" r="2.8" fill={spec.hubBg} stroke={spec.hubBorder} strokeWidth="1.4" />
      </>
    )}

    {spec.id === 'obsidian' && (
      /* Type 4 Preview: Royal Kiswah Rub el Hizb (۞) Golden Medallion */
      <>
        <Polygon points="23,6 20,16 26,16" fill={spec.needleNorthLeft} />
        <Rect x="16" y="16" width="14" height="14" rx="1.5" fill={spec.hubBg} stroke={spec.hubBorder} strokeWidth="1.4" />
        <G transform="rotate(45 23 23)">
          <Rect x="16" y="16" width="14" height="14" rx="1.5" fill={spec.hubBg} stroke={spec.hubBorder} strokeWidth="1.4" />
        </G>
        <Circle cx="23" cy="23" r="3" fill={spec.needleNorthLeft} />
      </>
    )}
  </Svg>
);

export const QiblaStylePicker: React.FC<QiblaStylePickerProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.dock,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {QIBLA_DIAL_STYLE_LIST.map((spec) => {
          const active = spec.id === selectedStyle;
          return (
            <Pressable
              key={spec.id}
              onPress={() => onSelectStyle(spec.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Compass style: ${spec.label}`}
              style={({ pressed }) => [
                styles.thumbItem,
                { transform: [{ scale: pressed ? 0.94 : active ? 1.05 : 1 }] },
              ]}
            >
              <View
                style={[
                  styles.thumbRing,
                  {
                    borderColor: active ? theme.colors.primary : 'transparent',
                    backgroundColor: active ? theme.colors.secondaryTint : 'transparent',
                  },
                ]}
              >
                <MiniDialThumb spec={spec} />
              </View>
              <AppText
                variant="caption"
                color={active ? theme.colors.primary : theme.colors.textMuted}
                style={[styles.label, active && styles.activeLabel]}
                numberOfLines={1}
              >
                {spec.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  dock: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  thumbRing: {
    padding: 3,
    borderRadius: RADIUS.full,
    borderWidth: 2,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  activeLabel: {
    fontWeight: '800',
  },
});
