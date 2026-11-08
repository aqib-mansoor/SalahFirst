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
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                },
                pressed && { opacity: 0.85 },
              ]}
            >
              <AppText
                variant="bodySmall"
                color={isActive ? theme.colors.textInverse : theme.colors.textMuted}
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
              >
                {tab.label}
              </AppText>
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
    padding: 3,
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
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 12.5,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
