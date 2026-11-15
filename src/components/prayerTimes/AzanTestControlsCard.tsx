import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { AzanReciterKey } from '@/utils/azanAudio';

export interface AzanTestControlsCardProps {
  currentReciter: AzanReciterKey;
  isTesting: boolean;
  testStatusText?: string;
  onTestAzan: () => void;
  onStopAzan: () => void;
}

export const AzanTestControlsCard: React.FC<AzanTestControlsCardProps> = ({
  currentReciter,
  isTesting,
  testStatusText,
  onTestAzan,
  onStopAzan,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
            Manual Azan Test
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={2} style={styles.captionText}>
            {testStatusText || `Test Azan recitation using selected reciter (${currentReciter}).`}
          </AppText>
        </View>

        <Pressable
          onPress={isTesting ? onStopAzan : onTestAzan}
          accessibilityRole="button"
          accessibilityLabel={isTesting ? 'Stop Test Azan' : 'Test Azan Now'}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: isTesting ? theme.colors.error : theme.colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          {isTesting ? (
            <>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M6 6h12v12H6z" fill={theme.colors.textOnPrimary} />
              </Svg>
              <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.btnText}>
                Stop Test
              </AppText>
            </>
          ) : (
            <>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M8 5v14l11-7z" fill={theme.colors.textOnPrimary} />
              </Svg>
              <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.btnText}>
                Test Azan Now
              </AppText>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  boldText: {
    fontWeight: '700',
  },
  captionText: {
    fontSize: 11,
    lineHeight: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.lg,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 12,
  },
});

