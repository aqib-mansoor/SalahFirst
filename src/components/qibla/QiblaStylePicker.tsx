import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Circle, Polygon, Line } from 'react-native-svg';
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
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Circle
      cx="22"
      cy="22"
      r="20"
      fill={spec.dialBg}
      stroke={spec.dialBorder}
      strokeWidth="2"
    />
    {/* Cardinal ticks */}
    <Line x1="22" y1="4" x2="22" y2="8" stroke={spec.northTick} strokeWidth="2" strokeLinecap="round" />
    <Line x1="22" y1="36" x2="22" y2="40" stroke={spec.tickMajor} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="4" y1="22" x2="8" y2="22" stroke={spec.tickMajor} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="36" y1="22" x2="40" y2="22" stroke={spec.tickMajor} strokeWidth="1.5" strokeLinecap="round" />

    {spec.id === 'rose' && (
      <Polygon
        points="22,9 24.5,19.5 35,22 24.5,24.5 22,35 19.5,24.5 9,22 19.5,19.5"
        fill={spec.innerRing}
      />
    )}

    {/* North Needle */}
    <Polygon points="22,8 25.5,22 18.5,22" fill={spec.needleNorthLeft} />
    {/* South Needle */}
    <Polygon points="22,36 25.5,22 18.5,22" fill={spec.needleSouthLeft} />
    {/* Hub */}
    <Circle cx="22" cy="22" r="3" fill={spec.hubBg} stroke={spec.hubBorder} strokeWidth="1.5" />
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

