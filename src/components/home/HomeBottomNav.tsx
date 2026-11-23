import React from 'react';
import { StyleSheet, View, Pressable, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { triggerHaptic } from '@/utils/haptics';
import { IslamicNavIcon } from './IslamicNavIcons';

import { HomeTab } from '@/types';
export type { HomeTab };

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

  const handleTabPress = (tabId: HomeTab) => {
    if (tabId === activeTab) return;
    triggerHaptic('light');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onTabChange(tabId);
  };

  const dockBorderColor = theme.isDark ? 'rgba(255, 255, 255, 0.12)' : theme.colors.border;
  const haloShadowColor = theme.isDark ? '#000000' : theme.colors.primary;

  return (
    <View
      style={[
        styles.floatingWrapper,
        {
          paddingBottom: Math.max(insets.bottom + 10, 22),
        },
      ]}
      pointerEvents="box-none"
    >
      {/* Elevated Floating Pill Dock */}
      <View
        style={[
          styles.islandDock,
          {
            backgroundColor: theme.colors.surface,
            borderColor: dockBorderColor,
            shadowColor: haloShadowColor,
          },
        ]}
        accessibilityRole="tablist"
        pointerEvents="auto"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (isActive) {
            const activeBg = theme.colors.secondaryTint;
            const activeColor = theme.colors.primary;

            return (
              <Pressable
                key={tab.id}
                onPress={() => handleTabPress(tab.id)}
                style={({ pressed }) => [
                  styles.activePill,
                  {
                    backgroundColor: activeBg,
                    borderColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                  },
                  pressed && { transform: [{ scale: 0.96 }], opacity: 0.88 },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: true }}
                accessibilityLabel={tab.label}
                hitSlop={6}
              >
                <IslamicNavIcon
                  tabId={tab.id}
                  isActive={true}
                  size={18}
                  customColor={activeColor}
                />
                <AppText
                  variant="caption"
                  color={activeColor}
                  style={styles.activeLabel}
                  numberOfLines={1}
                >
                  {tab.label}
                </AppText>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={({ pressed }) => [
                styles.inactiveTab,
                pressed && { opacity: 0.5, transform: [{ scale: 0.92 }] },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: false }}
              accessibilityLabel={tab.label}
              hitSlop={8}
            >
              <IslamicNavIcon
                tabId={tab.id}
                isActive={false}
                size={22}
                customColor={theme.colors.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    backgroundColor: 'transparent',
  },
  islandDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
    width: '100%',
    maxWidth: 420,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  activeLabel: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.1,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 12,
    minHeight: 42,
  },
});
