import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

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

  const renderIcon = (tabId: HomeTab, isActive: boolean) => {
    const strokeColor = isActive ? theme.colors.primary : theme.colors.textSubtle;

    switch (tabId) {
      case 'home':
        return (
          <View style={styles.homeIconWrapper}>
            {isActive && <View style={[styles.activeDot, { backgroundColor: theme.colors.accent }]} />}
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 3L4 9V20C4 20.55 4.45 21 5 21H19C19.55 21 20 20.55 20 20V9L12 3Z"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path d="M9 21V12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12V21" stroke={strokeColor} strokeWidth="2" />
            </Svg>
          </View>
        );
      case 'prayers':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth="2" />
            <Path d="M12 7V12L15 14" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );
      case 'qibla':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth="2" />
            <Path d="M14.5 9.5L9.5 14.5M16.5 7.5L12 19L10 14L5 12L16.5 7.5Z" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          </Svg>
        );
      case 'hadith':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" stroke={strokeColor} strokeWidth="2" />
          </Svg>
        );
      case 'progress':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M18 20V10M12 20V4M6 20V14" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
        );
    }
  };

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: Math.max(insets.bottom, 10),
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
            style={styles.tabButton}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            hitSlop={8}
          >
            {renderIcon(tab.id, isActive)}
            <AppText
              variant="caption"
              color={isActive ? theme.colors.primary : theme.colors.textSubtle}
              style={[styles.tabLabel, { fontWeight: isActive ? '700' : '500' }]}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: SPACING.sm,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
    minHeight: 48,
  },
  homeIconWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: -6,
  },
  tabLabel: {
    fontSize: 11,
  },
});
