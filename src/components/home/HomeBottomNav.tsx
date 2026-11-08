import React from 'react';
import { StyleSheet, View, Pressable, LayoutAnimation } from 'react-native';
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

  const handleTabPress = (tabId: HomeTab) => {
    if (tabId === activeTab) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onTabChange(tabId);
  };

  return (
    <View
      style={[
        styles.floatingWrapper,
        {
          paddingBottom: Math.max(insets.bottom + 10, 24),
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
            borderColor: theme.colors.border,
          },
        ]}
        accessibilityRole="tablist"
        pointerEvents="auto"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (isActive) {
            return (
              <Pressable
                key={tab.id}
                onPress={() => handleTabPress(tab.id)}
                style={({ pressed }) => [
                  styles.activePill,
                  {
                    backgroundColor: theme.colors.accentLight,
                    borderColor: theme.colors.accent,
                    shadowColor: theme.colors.accent,
                  },
                  pressed && { opacity: 0.85 },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: true }}
                accessibilityLabel={tab.label}
                hitSlop={6}
              >
                <IslamicNavIcon
                  tabId={tab.id}
                  isActive={true}
                  size={19}
                  customColor={theme.colors.textPrimary}
                />
                <AppText
                  variant="caption"
                  color={theme.colors.textPrimary}
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
                pressed && { opacity: 0.55 },
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
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    maxWidth: 420,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: RADIUS.md + 2,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activeLabel: {
    fontWeight: '800',
    fontSize: 12.5,
    letterSpacing: 0.2,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderRadius: RADIUS.md,
    minHeight: 44,
  },
});
