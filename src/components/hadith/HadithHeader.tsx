import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface HadithHeaderProps {
  showUrdu: boolean;
  onToggleUrdu: () => void;
}

export const HadithHeader: React.FC<HadithHeaderProps> = ({
  showUrdu,
  onToggleUrdu,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleColumn}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
          Hadith of the Day
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.subtitle}>
          Daily wisdom • Offline verified collection
        </AppText>
      </View>

      <Pressable
        onPress={onToggleUrdu}
        accessibilityRole="switch"
        accessibilityState={{ checked: showUrdu }}
        accessibilityLabel="Toggle Urdu translation"
        accessibilityHint="Shows or hides verified Urdu translations for Hadiths"
        hitSlop={8}
        style={({ pressed }) => [
          styles.toggleButton,
          showUrdu
            ? {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              }
            : {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary,
              },
          pressed && { opacity: 0.8 },
        ]}
      >
        {showUrdu ? (
          <AppText
            variant="bodySmall"
            color={theme.colors.textInverse}
            style={styles.activeToggleText}
          >
            EN + اردو
          </AppText>
        ) : (
          <View style={styles.toggleContentColumn}>
            <AppText
              variant="caption"
              color={theme.colors.primary}
              style={styles.toggleTextEn}
            >
              Show Urdu
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.primary}
              style={styles.toggleTextUr}
            >
              اردو
            </AppText>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  titleColumn: {
    flex: 1,
    gap: 2,
    marginRight: SPACING.sm,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    fontWeight: '500',
  },
  toggleButton: {
    minWidth: 88,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggleText: {
    fontWeight: '800',
    fontSize: 13,
  },
  toggleContentColumn: {
    alignItems: 'center',
    gap: 1,
  },
  toggleTextEn: {
    fontWeight: '700',
    fontSize: 12,
  },
  toggleTextUr: {
    fontWeight: '700',
    fontSize: 11,
  },
});
