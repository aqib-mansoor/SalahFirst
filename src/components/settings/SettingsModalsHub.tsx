import React from 'react';
import { LocationBottomSheet } from '@/components/prayerTimes/LocationBottomSheet';
import { LanguageBottomSheet } from './LanguageBottomSheet';
import { CalculationMethodBottomSheet } from './CalculationMethodBottomSheet';
import { PrayerAdjustmentsBottomSheet } from './PrayerAdjustmentsBottomSheet';
import { FiqhBottomSheet } from './FiqhBottomSheet';
import { BackupRestoreModal } from './BackupRestoreModal';
import { PresetCity } from '@/data';
import { CalculationMethodName, FiqhName, PrayerMinuteAdjustments } from '@/types';
import { FormattedPrayerTimes } from '@/utils/prayerTimes';

export interface SettingsModalsHubProps {
  sheetVisible: boolean;
  currentCityName: string;
  onSelectCity: (city: PresetCity) => void;
  onCloseLocation: () => void;
  calcMethodSheetVisible: boolean;
  calcMethod: CalculationMethodName;
  onSelectCalcMethod: (method: CalculationMethodName) => void;
  onCloseCalcMethod: () => void;
  fiqhSheetVisible: boolean;
  selectedFiqh: FiqhName;
  onSelectFiqh: (fiqh: FiqhName, applyCalc: boolean) => void;
  onCloseFiqh: () => void;
  languageSheetVisible: boolean;
  onCloseLanguage: () => void;
  backupModalVisible: boolean;
  onCloseBackup: () => void;
  adjustmentsSheetVisible: boolean;
  prayerAdjustments: PrayerMinuteAdjustments;
  prayerData: FormattedPrayerTimes;
  onUpdatePrayerAdjustments: (updated: PrayerMinuteAdjustments) => void;
  onCloseAdjustments: () => void;
}

export const SettingsModalsHub: React.FC<SettingsModalsHubProps> = ({
  sheetVisible,
  currentCityName,
  onSelectCity,
  onCloseLocation,
  calcMethodSheetVisible,
  calcMethod,
  onSelectCalcMethod,
  onCloseCalcMethod,
  fiqhSheetVisible,
  selectedFiqh,
  onSelectFiqh,
  onCloseFiqh,
  languageSheetVisible,
  onCloseLanguage,
  backupModalVisible,
  onCloseBackup,
  adjustmentsSheetVisible,
  prayerAdjustments,
  prayerData,
  onUpdatePrayerAdjustments,
  onCloseAdjustments,
}) => {
  return (
    <>
      <LocationBottomSheet
        visible={sheetVisible}
        currentCityName={currentCityName}
        onSelectCity={onSelectCity}
        onClose={onCloseLocation}
      />

      <CalculationMethodBottomSheet
        visible={calcMethodSheetVisible}
        selectedMethod={calcMethod}
        onSelectMethod={onSelectCalcMethod}
        onClose={onCloseCalcMethod}
      />

      <FiqhBottomSheet
        visible={fiqhSheetVisible}
        selectedFiqh={selectedFiqh}
        onSelectFiqh={onSelectFiqh}
        onClose={onCloseFiqh}
      />

      <LanguageBottomSheet
        visible={languageSheetVisible}
        onClose={onCloseLanguage}
      />

      <BackupRestoreModal
        visible={backupModalVisible}
        onClose={onCloseBackup}
      />

      <PrayerAdjustmentsBottomSheet
        visible={adjustmentsSheetVisible}
        adjustments={prayerAdjustments}
        currentTimes={prayerData}
        onUpdateAdjustments={onUpdatePrayerAdjustments}
        onClose={onCloseAdjustments}
      />
    </>
  );
};
