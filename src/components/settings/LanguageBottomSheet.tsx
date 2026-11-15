import React from 'react';
import { Modal, StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
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

  if (!visible) return null;

  const handleSelect = (code: 'en' | 'ur' | 'ar') => {
    setLanguage(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.handleBar}>
            <View style={[styles.handleIndicator, { backgroundColor: theme.colors.border }]} />
          </View>

          <View style={styles.header}>
            <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
              {t('language')}
            </AppText>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.textSecondary} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          <View style={styles.list}>
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
                        <Path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
  },
  handleIndicator: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  title: {
    fontWeight: '700',
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  list: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
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
