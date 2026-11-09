import { getLocalDateComponents } from './timezone';

/**
 * Calculates a respectful daytime delivery timestamp (10:00 AM - 8:00 PM local)
 * at least 24 hours after the user's last session.
 */
export const calculateReengagementTargetTime = (
  minEligibleDate: Date,
  timezone?: string
): Date => {
  const local = getLocalDateComponents(minEligibleDate, timezone);
  const targetDate = new Date(minEligibleDate);

  let startTotalMins = 10 * 60; // 10:00 AM = 600 mins
  const endTotalMins = 20 * 60;  // 08:00 PM = 1200 mins

  if (local.hour >= 20) {
    // Past 8:00 PM in local time, advance to next calendar day
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (local.hour >= 10) {
    // Within 10:00 AM - 8:00 PM, target between now+15m and 8:00 PM
    const currentMins = local.hour * 60 + local.minute;
    startTotalMins = Math.min(endTotalMins - 15, currentMins + 15);
  }

  const range = Math.max(1, endTotalMins - startTotalMins);
  const randomMins = Math.floor(Math.random() * range);
  const chosenTotalMins = startTotalMins + randomMins;

  targetDate.setHours(Math.floor(chosenTotalMins / 60), chosenTotalMins % 60, 0, 0);
  return targetDate;
};
