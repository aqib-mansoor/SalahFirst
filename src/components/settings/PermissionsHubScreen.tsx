import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Pressable, AppState } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import {
  AppContainer,
  AppText,
  ScreenHeader,
  PermissionGuideBottomSheet,
} from '@/components/common';
import {
  PermissionKey,
  SystemPermissionsStatus,
  fetchPermissionsStatus,
} from '@/native/FocusBlockerBridge';
import { PERMISSION_GUIDES } from '@/constants/permissionGuides';

export interface PermissionsHubScreenProps {
  onBack: () => void;
}

export const PermissionsHubScreen: React.FC<PermissionsHubScreenProps> = ({ onBack }) => {
  const theme = useTheme();
  const [status, setStatus] = useState<SystemPermissionsStatus>({
    accessibility: false,
    overlay: false,
    exactAlarm: true,
    batteryOptimization: false,
    notifications: true,
  });
  const [activeSheetKey, setActiveSheetKey] = useState<PermissionKey | null>(null);

  const refreshStatus = useCallback(() => {
    fetchPermissionsStatus().then(setStatus);
  }, []);

  useEffect(() => {
    refreshStatus();
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') refreshStatus();
    });
    return () => sub.remove();
  }, [refreshStatus]);

  const permissionKeys: PermissionKey[] = [
    'batteryOptimization',
    'exactAlarm',
    'accessibility',
    'overlay',
    'notifications',
  ];

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Phone Permissions"
          subtitle="Ensure on-time Azan and distraction shielding"
          onBack={onBack}
        />

        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.infoText}>
              SalahFirst runs 100% offline with zero user tracking. All system permissions are strictly utilized on-device to deliver timely Azans and maintain your prayer focus.
            </AppText>
          </View>

          <View style={styles.list}>
            {permissionKeys.map((key) => {
              const guide = PERMISSION_GUIDES[key];
              const isGranted = status[key];
              return (
                <Pressable
                  key={key}
                  onPress={() => setActiveSheetKey(key)}
                  style={({ pressed }) => [
                    styles.itemCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: isGranted ? theme.colors.border : theme.colors.primary,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <View style={styles.itemLeft}>
                    <View style={styles.itemTitleRow}>
                      <AppText variant="titleSmall" color={theme.colors.text} style={styles.itemTitle}>
                        {guide.title}
                      </AppText>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isGranted
                              ? theme.colors.mintTint
                              : theme.colors.surfaceSubtle,
                          },
                        ]}
                      >
                        <AppText
                          variant="caption"
                          color={isGranted ? theme.colors.primary : theme.colors.textMuted}
                          style={styles.statusBadgeText}
                        >
                          {isGranted ? 'Enabled' : 'Action Needed'}
                        </AppText>
                      </View>
                    </View>
                    <AppText variant="caption" color={theme.colors.textMuted} style={styles.itemTagline}>
                      {guide.tagline}
                    </AppText>
                  </View>

                  <AppText variant="caption" color={theme.colors.primary} style={styles.arrowIcon}>
                    Manage →
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <PermissionGuideBottomSheet
          visible={activeSheetKey !== null}
          permissionKey={activeSheetKey}
          onClose={() => setActiveSheetKey(null)}
          onSettingsOpened={refreshStatus}
        />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollWrapper: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  infoCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  infoText: {
    lineHeight: 18,
    fontSize: 12.5,
  },
  list: {
    gap: SPACING.sm + 2,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  itemLeft: {
    flex: 1,
    gap: 3,
    paddingRight: SPACING.sm,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 1.5,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: {
    fontWeight: '700',
    fontSize: 10,
  },
  itemTagline: {
    fontSize: 11.5,
  },
  arrowIcon: {
    fontWeight: '700',
    fontSize: 12,
  },
});

