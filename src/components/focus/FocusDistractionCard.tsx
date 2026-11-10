import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { DISTRACTING_APPS_CATALOG } from '@/native/FocusBlockerBridge';

export interface FocusDistractionCardProps {
  selectedPackages: string[];
  onTogglePackage: (pkg: string) => void;
  onOpenPermissionSetup?: () => void;
  hasAccessibility?: boolean;
}

export const FocusDistractionCard: React.FC<FocusDistractionCardProps> = ({
  selectedPackages,
  onTogglePackage,
  onOpenPermissionSetup,
  hasAccessibility = false,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.titleRow}>
        <View style={styles.titleWithIcon}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
            App Distraction Shield
          </AppText>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: hasAccessibility ? theme.colors.mintTint : theme.colors.surfaceSubtle },
          ]}
        >
          <AppText
            variant="caption"
            color={hasAccessibility ? theme.colors.primary : theme.colors.textMuted}
            style={styles.badgeText}
          >
            {hasAccessibility ? 'Shield Active' : 'Setup Required'}
          </AppText>
        </View>
      </View>

      <AppText variant="caption" color={theme.colors.textMuted} style={styles.description}>
        Select apps to automatically intercept and redirect back to Salah during your focus session.
      </AppText>

      {!hasAccessibility && onOpenPermissionSetup && (
        <Pressable
          onPress={onOpenPermissionSetup}
          style={[styles.permNotice, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}
        >
          <AppText variant="caption" color={theme.colors.primary} style={styles.permText}>
            Tap to enable App Blocker in Android Accessibility Settings →
          </AppText>
        </Pressable>
      )}

      <View style={styles.grid}>
        {DISTRACTING_APPS_CATALOG.map((item) => {
          const isSelected = selectedPackages.includes(item.package);
          return (
            <Pressable
              key={item.id}
              onPress={() => onTogglePackage(item.package)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.colors.mintTint : theme.colors.surfaceSubtle,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.chipTextColumn}>
                <AppText variant="bodySmall" color={theme.colors.text} style={styles.chipTitle}>
                  {item.name}
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted} style={styles.chipSub}>
                  {item.id === 'whatsapp' ? 'Messages only' : 'Distraction feed'}
                </AppText>
              </View>

              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                {isSelected && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="M20 6L9 17L4 12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  permNotice: {
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  permText: {
    fontWeight: '600',
    fontSize: 11.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  chipTextColumn: {
    flex: 1,
    gap: 1,
  },
  chipTitle: {
    fontWeight: '700',
    fontSize: 12.5,
  },
  chipSub: {
    fontSize: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
