import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export type ProgressSubTab = 'tracker' | 'streaks' | 'calendar';

export interface ProgressTabsHeaderProps {
  activeTab: ProgressSubTab;
  onTabChange: (tab: ProgressSubTab) => void;
}

export const ProgressTabsHeader: React.FC<ProgressTabsHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const theme = useTheme();

  const tabs: { id: ProgressSubTab; label: string }[] = [
    { id: 'tracker', label: 'Tracker' },
    { id: 'streaks', label: 'Streaks' },
    { id: 'calendar', label: 'Calendar' },
  ];

  return (
    <View style={styles.container}>
      <View
        accessibilityRole="tablist"
        style={[
          styles.tabBarSurface,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} view`}
              style={({ pressed }) => [
                styles.tabItem,
                isActive && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.accent,
                  borderWidth: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 2,
                },
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.tabContentRow}>
                <AppText
                  variant="bodySmall"
                  color={isActive ? theme.colors.textInverse : theme.colors.textMuted}
                  style={[styles.tabLabel, isActive && styles.activeTabLabel]}
                >
                  {tab.label}
                </AppText>
                {isActive && (
                  <View
                    style={[
                      styles.activeGoldDot,
                      { backgroundColor: theme.colors.accent },
                    ]}
                  />
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
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  tabBarSurface: {
    flexDirection: 'row',
    borderRadius: RADIUS.full,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: SPACING.xs + 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabLabel: {
    fontWeight: '800',
  },
  activeGoldDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
