import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { IslamicNavIcon } from './IslamicNavIcons';

export type HomeTab = 'home' | 'prayers' | 'qibla' | 'hadith' | 'progress';

export interface HomeBottomNavProps {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}

export const HomeBottomNav: React.FC<HomeBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const tabs: { id: HomeTab; label: string }[] = [
    { id: 'home', label: t('navHome') },
    { id: 'prayers', label: t('navPrayers') },
    { id: 'qibla', label: t('navQibla') },
    { id: 'hadith', label: t('navHadith') },
    { id: 'progress', label: t('navProgress') },
  ];

  return (
    <View
      style={[
        styles.floatingWrapper,
        {
          paddingBottom: Math.max(insets.bottom, SPACING.xs),
        },
      ]}
      pointerEvents="box-none"
    >
      {/* Floating Island Navigation Dock */}
      <View
        style={[
          styles.islandDock,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        accessibilityRole="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={({ pressed }) => [
                styles.tabButton,
                isActive && [
                  styles.activeTabButton,
                  {
                    backgroundColor: theme.colors.accentTint,
                    borderColor: theme.colors.accent,
                  },
                ],
                pressed && { opacity: 0.75 },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              hitSlop={6}
            >
              <IslamicNavIcon tabId={tab.id} isActive={isActive} size={21} />

              <AppText
                variant="caption"
                color={isActive ? theme.colors.textPrimary : theme.colors.textSecondary}
                style={[
                  styles.tabLabel,
                  {
                    fontWeight: isActive ? '800' : '600',
                    color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
                  },
                ]}
                numberOfLines={1}
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
  floatingWrapper: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  islandDock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs + 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 48,
  },
  activeTabButton: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tabLabel: {
    fontSize: 10.5,
    letterSpacing: 0.1,
  },
});
