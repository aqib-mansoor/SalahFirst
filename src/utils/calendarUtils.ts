import { formatDateKey, getIslamicMonthFormatted } from './trackerStatistics';

export interface CalendarDayCell {
  dayNumber: number;
  dateKey: string;
  isToday: boolean;
  isEditable: boolean;
  isSelected: boolean;
  isFuture: boolean;
  hasRecord: boolean;
  completedPrayers: boolean[]; // [Fajr, Dhuhr, Asr, Maghrib, Isha]
  completedCount: number;
}

export interface CalendarMonthData {
  year: number;
  monthIndex: number;
  monthName: string;
  hijriMonth: string;
  daysInMonth: number;
  leadingEmptyCount: number;
  cells: CalendarDayCell[];
}

const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const generateCalendarMonth = (
  year: number,
  monthIndex: number,
  history: Record<string, Record<string, boolean>>,
  selectedDay: number,
  today: Date = new Date()
): CalendarMonthData => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay(); // 0 = Sun
  const todayKey = formatDateKey(today);
  const yesterdayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterdayDate);

  const monthName = new Date(year, monthIndex, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const midDate = new Date(year, monthIndex, Math.min(15, daysInMonth));
  const hijriMonth = getIslamicMonthFormatted(midDate);

  const cells: CalendarDayCell[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    const record = history[dateKey];
    const hasRecord = !!record;
    const completedPrayers = PRAYER_KEYS.map((k) => !!record?.[k]);
    const completedCount = completedPrayers.filter(Boolean).length;

    cells.push({
      dayNumber: d,
      dateKey,
      isToday: dateKey === todayKey,
      isEditable: dateKey === todayKey || dateKey === yesterdayKey,
      isSelected: d === selectedDay,
      isFuture: dateKey > todayKey,
      hasRecord,
      completedPrayers,
      completedCount,
    });
  }

  return {
    year,
    monthIndex,
    monthName,
    hijriMonth,
    daysInMonth,
    leadingEmptyCount: firstWeekday,
    cells,
  };
};

