/**
 * SalahFirst Quiet Hours Evaluation Utility
 * Evaluates whether a timestamp falls inside user-configured quiet hours.
 */

export const isWithinQuietHours = (
  date: Date,
  startStr: string = '22:00',
  endStr: string = '05:00'
): boolean => {
  const [startHour, startMin] = startStr.split(':').map(Number);
  const [endHour, endMin] = endStr.split(':').map(Number);

  const hour = date.getHours();
  const min = date.getMinutes();
  const currentMinutes = hour * 60 + min;
  const startMinutes = (startHour || 0) * 60 + (startMin || 0);
  const endMinutes = (endHour || 0) * 60 + (endMin || 0);

  if (startMinutes <= endMinutes) {
    // Same-day range
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  // Cross-midnight range (e.g., 22:00 to 05:00)
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
};

