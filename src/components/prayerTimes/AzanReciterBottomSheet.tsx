import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppBottomSheet, AppButton } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { AzanReciterKey } from '@/utils/azanAudio';
import { triggerHaptic } from '@/utils/haptics';
import { AzanReciterRowItem, ReciterItem } from './AzanReciterRowItem';

export interface AzanReciterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  currentReciter: AzanReciterKey;
  isPlaying: boolean;
  isLoading: boolean;
  onSelectReciter: (key: AzanReciterKey) => void;
  onTogglePlay: (key?: AzanReciterKey) => void;
}

const RECITERS: ReciterItem[] = [
  { id: 'makkah', labelKey: 'reciterMakkah', subtitleKey: 'reciterMakkahSub' },
  { id: 'madinah', labelKey: 'reciterMadinah', subtitleKey: 'reciterMadinahSub' },
  { id: 'alAqsa', labelKey: 'reciterAlAqsa', subtitleKey: 'reciterAlAqsaSub' },
  { id: 'alafasy', labelKey: 'reciterAlafasy', subtitleKey: 'reciterAlafasySub' },
  { id: 'qatami', labelKey: 'reciterQatami', subtitleKey: 'reciterQatamiSub' },
];

export const AzanReciterBottomSheet: React.FC<AzanReciterBottomSheetProps> = ({
  visible,
  onClose,
  currentReciter,
  isPlaying,
  isLoading,
  onSelectReciter,
  onTogglePlay,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSelect = (key: AzanReciterKey) => {
    triggerHaptic();
    onSelectReciter(key);
  };

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
        stroke={theme.colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
        stroke={theme.colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('chooseAzanVoice')}
      subtitleText={t('chooseAzanVoiceSubtitle')}
      icon={headerIcon}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        <View
          style={[
            styles.listContainer,
            {
              backgroundColor: theme.isDark ? '#081F17' : theme.colors.surface,
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.12)' : theme.colors.border,
            },
          ]}
        >
          {RECITERS.map((item, index) => (
            <AzanReciterRowItem
              key={item.id}
              item={item}
              isSelected={currentReciter === item.id}
              isThisPlaying={isPlaying && currentReciter === item.id}
              isLoading={isLoading}
              isLast={index === RECITERS.length - 1}
              onSelect={handleSelect}
              onTogglePlay={onTogglePlay}
            />
          ))}
        </View>

        <View style={styles.footerSpacing}>
          <AppButton
            label={t('close')}
            onPress={onClose}
            variant="primary"
            size="md"
          />
        </View>
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollList: {
    paddingBottom: SPACING.lg,
  },
  listContainer: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  footerSpacing: {
    marginTop: SPACING.lg,
  },
});
