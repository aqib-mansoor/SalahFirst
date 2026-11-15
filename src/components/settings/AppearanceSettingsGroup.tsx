import React from 'react';
import { StyleSheet, View, Pressable, Switch } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { ThemeMode, TimeFormat } from '@/types';
import { useTranslation } from '@/context/LocalizationContext';

export interface AppearanceSettingsGroupProps {
  themeMode: ThemeMode;
  onSelectThemeMode: (mode: ThemeMode) => void;
  timeFormat: TimeFormat;
  onSelectTimeFormat: (format: TimeFormat) => void;
  languageLabel: string;
  onOpenLanguageSheet: () => void;
  hapticFeedback?: boolean;
  onToggleHapticFeedback?: (enabled: boolean) => void;
}

export const AppearanceSettingsGroup: React.FC<AppearanceSettingsGroupProps> = ({
  themeMode,
  onSelectThemeMode,
  timeFormat,
  onSelectTimeFormat,
  languageLabel,
  onOpenLanguageSheet,
  hapticFeedback = true,
  onToggleHapticFeedback,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const MODES: { id: ThemeMode; label: string }[] = [
    { id: 'light', label: t('themeLight') },
    { id: 'dark', label: t('themeDark') },
    { id: 'system', label: t('themeSystem') },
  ];

  const TIME_FORMATS: { id: TimeFormat; label: string }[] = [
    { id: '12h', label: '12H' },
    { id: '24h', label: '24H' },
  ];

  const themeSubtitle =
    themeMode === 'dark'
      ? t('themeDark')
      : themeMode === 'light'
      ? t('themeLight')
      : t('themeSystem');

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.sectionLabel}>
        {t('appearanceAndLanguage').toUpperCase()}
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Theme Mode Info + 3-way Segmented Control */}
        <View style={styles.themeRow}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.accentTint }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="5" stroke={theme.colors.accent} strokeWidth="2" />
                <Path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke={theme.colors.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('theme')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {themeSubtitle}
              </AppText>
            </View>
          </View>

          <View style={[styles.segmentTrack, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
            {MODES.map((mode) => {
              const isSelected = themeMode === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  onPress={() => onSelectThemeMode(mode.id)}
                  style={({ pressed }) => [
                    styles.segmentItem,
                    isSelected && [styles.segmentSelected, { backgroundColor: theme.colors.primary }],
                    pressed && !isSelected && { opacity: 0.7 },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                    style={[styles.segmentText, isSelected && styles.segmentTextSelected]}
                  >
                    {mode.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Time Format (12h vs 24h) */}
        <View style={styles.themeRow}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke={theme.colors.primary} strokeWidth="2" />
                <Path d="M12 7v5l3 3" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('timeFormat')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {timeFormat === '12h' ? t('timeFormat12h') : t('timeFormat24h')}
              </AppText>
            </View>
          </View>

          <View style={[styles.segmentTrack, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
            {TIME_FORMATS.map((tf) => {
              const isSelected = timeFormat === tf.id;
              return (
                <Pressable
                  key={tf.id}
                  onPress={() => onSelectTimeFormat(tf.id)}
                  style={({ pressed }) => [
                    styles.segmentItem,
                    isSelected && [styles.segmentSelected, { backgroundColor: theme.colors.primary }],
                    pressed && !isSelected && { opacity: 0.7 },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                    style={[styles.segmentText, isSelected && styles.segmentTextSelected]}
                  >
                    {tf.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 3: App Language Selector */}
        <Pressable onPress={onOpenLanguageSheet} style={styles.row}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={theme.colors.primary} strokeWidth="2" />
                <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('language')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                English, اردو & العربية
              </AppText>
            </View>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: theme.colors.secondaryTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.pillText}>
              {languageLabel}
            </AppText>
          </View>
        </Pressable>

        {onToggleHapticFeedback && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.row}>
              <View style={styles.leftRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.mintTint }]}>
                  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M6 8v8M18 8v8M3 10v4M21 10v4M9 5h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
                      stroke={theme.colors.primary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <View style={styles.textCol}>
                  <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                    {t('hapticFeedbackTitle')}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {t('hapticFeedbackSub')}
                  </AppText>
                </View>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={onToggleHapticFeedback}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.textOnPrimary}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: SPACING.xs + 2 },
  sectionLabel: { fontWeight: '800', letterSpacing: 0.8, paddingHorizontal: SPACING.xs },
  card: { borderRadius: RADIUS.xl, borderWidth: 1, overflow: 'hidden' },
  themeRow: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 4, gap: SPACING.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm + 4, flex: 1, paddingRight: SPACING.sm },
  iconBox: { width: 36, height: 36, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  textCol: { flex: 1, gap: 2 },
  rowTitle: { fontWeight: '700' },
  segmentTrack: { flexDirection: 'row', borderRadius: RADIUS.md, borderWidth: 1, padding: 3, gap: 2 },
  segmentItem: { flex: 1, paddingVertical: 6, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.sm + 2 },
  segmentSelected: { elevation: 1 },
  segmentText: { fontSize: 12, fontWeight: '500' },
  segmentTextSelected: { fontWeight: '700' },
  pillBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  pillText: { fontWeight: '700' },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 60 },
});
