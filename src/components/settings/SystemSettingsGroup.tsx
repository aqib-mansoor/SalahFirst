import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/constants/theme';
import { ThemeMode, TimeFormat } from '@/types';
import { AppearanceSettingsGroup } from './AppearanceSettingsGroup';
import { InspirationSettingsGroup } from './InspirationSettingsGroup';
import { ReengagementSettingsGroup } from './ReengagementSettingsGroup';
import { GeneralSettingsGroup } from './GeneralSettingsGroup';

export interface SystemSettingsGroupProps {
  themeMode: ThemeMode;
  onSelectThemeMode: (mode: ThemeMode) => void;
  timeFormat: TimeFormat;
  onSelectTimeFormat: (format: TimeFormat) => void;
  languageLabel: string;
  onOpenLanguageSheet: () => void;
  hapticFeedback?: boolean;
  onToggleHapticFeedback?: (enabled: boolean) => void;
  inspirationEnabled?: boolean;
  onToggleInspiration?: (enabled: boolean) => void;
  reengagementEnabled?: boolean;
  onToggleReengagement?: (enabled: boolean) => void;
  onOpenBackupRestore?: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onOpenChangelog?: () => void;
}

export const SystemSettingsGroup: React.FC<SystemSettingsGroupProps> = ({
  themeMode,
  onSelectThemeMode,
  timeFormat,
  onSelectTimeFormat,
  languageLabel,
  onOpenLanguageSheet,
  hapticFeedback,
  onToggleHapticFeedback,
  inspirationEnabled = true,
  onToggleInspiration,
  reengagementEnabled = true,
  onToggleReengagement,
  onOpenBackupRestore,
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenChangelog,
}) => {
  return (
    <View style={styles.container}>
      <AppearanceSettingsGroup
        themeMode={themeMode}
        onSelectThemeMode={onSelectThemeMode}
        timeFormat={timeFormat}
        onSelectTimeFormat={onSelectTimeFormat}
        languageLabel={languageLabel}
        onOpenLanguageSheet={onOpenLanguageSheet}
        hapticFeedback={hapticFeedback}
        onToggleHapticFeedback={onToggleHapticFeedback}
      />

      {onToggleInspiration && (
        <InspirationSettingsGroup
          enabled={inspirationEnabled}
          onToggleEnabled={onToggleInspiration}
        />
      )}

      {onToggleReengagement && (
        <ReengagementSettingsGroup
          enabled={reengagementEnabled}
          onToggleEnabled={onToggleReengagement}
        />
      )}

      <GeneralSettingsGroup
        onOpenPrivacyPolicy={onOpenPrivacyPolicy}
        onOpenTerms={onOpenTerms}
        onOpenChangelog={onOpenChangelog}
        onOpenBackupRestore={onOpenBackupRestore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
});
