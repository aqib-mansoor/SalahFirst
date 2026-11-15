import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface LanguageBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface LanguageOption {
  code: 'en' | 'ur' | 'ar';
  label: string;
  nativeTitle: string;
  subtitle: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeTitle: 'English',
    subtitle: 'Full interface & verified translations',
  },
  {
    code: 'ur',
    label: 'اردو',
    nativeTitle: 'اردو (Urdu)',
    subtitle: 'مکمل اردو ترجمہ اور اسلامی اصطلاحات',
  },
  {
    code: 'ar',
    label: 'العربية',
    nativeTitle: 'العربية (Arabic)',
    subtitle: 'لغة القرآن الكريم والواجهة الأصلية',
  },
];

export const LanguageBottomSheet: React.FC<LanguageBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const handleSelect = (code: 'en' | 'ur' | 'ar') => {
    setLanguage(code);
    onClose();
  };

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={theme.colors.primary} strokeWidth="2.2" />
      <Path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={theme.colors.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('language')}
      badgeText={t('threeLanguagesBadge')}
      subtitleText="English, اردو & العربية"
      icon={headerIcon}
    >
      <View
        style={[
          styles.listCard,
          {
            backgroundColor: theme.isDark
              ? theme.colors.surfaceSubtle
              : theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {LANGUAGES.map((lang, idx) => {
          const isSelected = language === lang.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => handleSelect(lang.code)}
              style={({ pressed }) => [
                styles.optionRow,
                idx > 0 && [styles.rowBorder, { borderColor: theme.colors.border }],
                isSelected && { backgroundColor: theme.colors.secondaryTint },
                pressed && { opacity: 0.75 },
              ]}
            >
              <View style={styles.textCol}>
                <AppText
                  variant="bodyMedium"
                  color={isSelected ? theme.colors.primary : theme.colors.textPrimary}
                  style={[styles.nativeTitle, isSelected && styles.selectedTitle]}
                >
                  {lang.nativeTitle}
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  {lang.subtitle}
                </AppText>
              </View>

              {isSelected && (
                <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17l-5-5"
                      stroke={theme.colors.textOnPrimary}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  listCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textCol: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.sm,
  },
  nativeTitle: {
    fontWeight: '600',
  },
  selectedTitle: {
    fontWeight: '700',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
