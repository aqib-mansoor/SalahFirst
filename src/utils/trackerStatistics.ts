export interface DayOverview {
  dayLabel: string;
  completed: number;
  total: number;
  isToday: boolean;
  hasRecord: boolean;
  dateKey: string;
}

export interface DayBarData {
  dayName: string;
  completed: number;
  total: number;
  hasRecord: boolean;
  dateKey: string;
}

export interface StreaksSummary {
  currentStreak: number;
  longestStreak: number;
  longestStreakNote: string;
  totalPrayers: number;
}

export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getIslamicMonthFormatted = (date: Date): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      month: 'long',
      year: 'numeric',
    });
    return `${formatter.format(date)} AH`;
  } catch {
    return 'Dhu al-Qi’dah 1447 AH';
  }
};

/**
 * Calculates current active streak of consecutive days with all 5 daily prayers completed.
 * If today is in progress (< 5), preserves streak from yesterday if yesterday was 5/5.
 */
export const calculateCurrentStreak = (
  history: Record<string, Record<string, boolean>>,
  refDate: Date = new Date()
): number => {
  const todayKey = formatDateKey(refDate);
  const todayData = history[todayKey];
  const todayCount = todayData ? Object.values(todayData).filter(Boolean).length : 0;

  let streak = 0;
  if (todayCount === 5) {
    streak = 1;
  }

  for (let i = 1; i <= 365; i++) {
    const prev = new Date(refDate);
    prev.setDate(refDate.getDate() - i);
    const key = formatDateKey(prev);
    const dayData = history[key];
    const count = dayData ? Object.values(dayData).filter(Boolean).length : 0;

    if (count === 5) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Scans all historical date records chronologically to find the maximum contiguous run
 * of days where all 5 prayers were completed.
 */
export const calculateLongestStreak = (
  history: Record<string, Record<string, boolean>>
): { longestStreak: number; streakNote: string } => {
  const fullDates = Object.entries(history)
    .filter(([_, prayers]) => prayers && Object.values(prayers).filter(Boolean).length === 5)
    .map(([dateKey]) => dateKey)
    .sort();

  if (fullDates.length === 0) {
    return { longestStreak: 0, streakNote: 'Begin your streak' };
  }

  let maxStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < fullDates.length; i++) {
    const prevDate = new Date(`${fullDates[i - 1]}T00:00:00`);
    const currDate = new Date(`${fullDates[i]}T00:00:00`);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun++;
      if (currentRun > maxStreak) {
        maxStreak = currentRun;
      }
    } else {
      currentRun = 1;
    }
  }

  return {
    longestStreak: maxStreak,
    streakNote: maxStreak >= 7 ? 'Personal Best' : `${maxStreak} days completed`,
  };
};

/**
 * Sums all completed prayers across recorded user history.
 */
export const calculateTotalPrayers = (
  history: Record<string, Record<string, boolean>>
): number => {
  let total = 0;
  Object.values(history).forEach((dayMap) => {
    if (dayMap) {
      total += Object.values(dayMap).filter(Boolean).length;
    }
  });
  return total;
};

/**
 * Generates the last 7 calendar days dynamically ending on refDate.
 * Seamlessly handles transitions across months and years.
 */
export const getLast7Days = (
  history: Record<string, Record<string, boolean>>,
  refDate: Date = new Date()
): { dayOverview: DayOverview[]; dayBarData: DayBarData[] } => {
  const dayOverview: DayOverview[] = [];
  const dayBarData: DayBarData[] = [];
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayKey = formatDateKey(refDate);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - i);
    const dateKey = formatDateKey(d);
    const dayRecord = history[dateKey];
    const hasRecord = !!dayRecord;
    const completed = hasRecord ? Object.values(dayRecord).filter(Boolean).length : 0;
    const isToday = dateKey === todayKey;
    const dayOfWeek = d.getDay();

    dayOverview.push({
      dayLabel: dayLetters[dayOfWeek],
      completed,
      total: 5,
      isToday,
      hasRecord,
      dateKey,
    });

    dayBarData.push({
      dayName: dayNames[dayOfWeek],
      completed,
      total: 5,
      hasRecord,
      dateKey,
    });
  }

  return { dayOverview, dayBarData };
};

