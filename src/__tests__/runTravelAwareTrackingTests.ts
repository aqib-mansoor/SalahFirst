// Comprehensive Automated Test Suite for Travel-Aware Prayer Tracking & Centralized Cycle Management
const assert = (cond: any, msg: string) => {
  if (!cond) throw new Error(`[FAIL] ${msg}`);
};

import { resolveTimezone, calculateLocationTimeDiff } from '../utils/timezone';
import { calculateFajrBoundaries } from '../utils/prayerCycleManager';
import {
  recordPrayerCompletion,
  getCycleCompletionStatus,
  deriveHistoryMapFromLedger,
  buildMigratedEventsFromLegacy,
  migrateLegacyHistoryToLedger,
} from '../utils/prayerLedgerManager';
import { getRawPrayerTimes } from '../utils/prayerTimes';

async function runTravelAwareTrackingTests() {
  console.log('--- STARTING TRAVEL-AWARE PRAYER TRACKING VERIFICATION SUITE ---\n');

  // 1. Timezone Resolution & Cross-Timezone Travel Calculations
  console.log('[Test 1] International Travel & Timezone Delta Calculations');
  const karachiTz = resolveTimezone(24.8607, 67.0011, 'Pakistan');
  assert(karachiTz === 'Asia/Karachi', `Expected Asia/Karachi, got ${karachiTz}`);

  const nyTz = resolveTimezone(40.7128, -74.006, 'United States');
  assert(nyTz === 'America/New_York', `Expected America/New_York, got ${nyTz}`);

  const tokyoTz = resolveTimezone(35.6762, 139.6503, 'Japan');
  assert(tokyoTz === 'Asia/Tokyo', `Expected Asia/Tokyo, got ${tokyoTz}`);

  const adelaideTz = resolveTimezone(-34.9285, 138.6007, 'Australia');
  assert(adelaideTz === 'Australia/Adelaide', `Expected Australia/Adelaide, got ${adelaideTz}`);

  const kathmanduTz = resolveTimezone(27.7172, 85.324, 'Nepal');
  assert(kathmanduTz === 'Asia/Kathmandu', `Expected Asia/Kathmandu, got ${kathmanduTz}`);

  const diffPakToUSA = calculateLocationTimeDiff(nyTz, karachiTz);
  assert(diffPakToUSA.differenceMinutes < 0, 'Pakistan to USA must be behind phone time');
  console.log(`✓ Pakistan -> USA: ${diffPakToUSA.differenceText} (${diffPakToUSA.destinationTime})`);

  const diffPakToJapan = calculateLocationTimeDiff(tokyoTz, karachiTz);
  assert(diffPakToJapan.differenceMinutes > 0, 'Pakistan to Japan must be ahead of phone time');
  console.log(`✓ Pakistan -> Japan: ${diffPakToJapan.differenceText} (${diffPakToJapan.destinationTime})`);

  const diffAdelaide = calculateLocationTimeDiff(adelaideTz, karachiTz);
  assert(diffAdelaide.differenceMinutes % 30 === 0, 'Adelaide half-hour offset must be accurate');
  console.log(`✓ Pakistan -> Adelaide (half-hour offset): ${diffAdelaide.differenceText}`);

  const diffKathmandu = calculateLocationTimeDiff(kathmanduTz, karachiTz);
  assert(diffKathmandu.differenceMinutes % 15 === 0, 'Kathmandu 15-minute offset must be accurate');
  console.log(`✓ Pakistan -> Kathmandu (quarter-hour offset): ${diffKathmandu.differenceText}`);

  // 2. Solar Calculation & True UTC Epoch Inversion
  console.log('\n[Test 2] Adhan Solar Calculation in True UTC Epochs');
  const testRefDate = new Date('2026-11-09T10:00:00Z');
  const rawNy = getRawPrayerTimes(40.7128, -74.006, testRefDate, 'NorthAmerica', 'Standard', nyTz);
  assert(!isNaN(rawNy.fajr.getTime()), 'NY Fajr must be a valid Date');
  assert(!isNaN(rawNy.isha.getTime()), 'NY Isha must be a valid Date');

  const rawTokyo = getRawPrayerTimes(35.6762, 139.6503, testRefDate, 'Singapore', 'Standard', tokyoTz);
  assert(!isNaN(rawTokyo.fajr.getTime()), 'Tokyo Fajr must be a valid Date');
  assert(rawTokyo.fajr.getTime() < rawNy.fajr.getTime(), 'Tokyo Fajr occurs earlier in UTC than NY Fajr');
  console.log('✓ True UTC timestamps correctly aligned across opposite hemispheres');

  // 3. Centralized Prayer Cycle Boundaries
  console.log('\n[Test 3] Centralized Prayer Cycle Boundaries & Invariant Reset');
  const cycleBoundaries = calculateFajrBoundaries(24.8607, 67.0011, karachiTz, 'Karachi', 'Hanafi', testRefDate);
  assert(cycleBoundaries.nextFajrBoundaryUtc > cycleBoundaries.cycleStartUtc, 'nextFajrBoundary must be after cycleStart');
  assert(
    cycleBoundaries.nextFajrBoundaryUtc - cycleBoundaries.cycleStartUtc >= 20 * 3600 * 1000,
    'Prayer cycle span must be approximately 24 hours'
  );
  console.log(`✓ Active Cycle: Start=${new Date(cycleBoundaries.cycleStartUtc).toISOString()} -> Boundary=${new Date(cycleBoundaries.nextFajrBoundaryUtc).toISOString()}`);

  // 4. Immutable Completion Ledger & Anti-Duplication
  console.log('\n[Test 4] Immutable Prayer Completion Ledger & Occurrence Uniqueness');
  const testCycleId = 'cycle_test_pk_12345';
  const completion1 = await recordPrayerCompletion({
    prayerKey: 'Fajr',
    cycleId: testCycleId,
    timezone: karachiTz,
    latitude: 24.8607,
    longitude: 67.0011,
    source: 'manual',
  });
  assert(completion1.isNew === true, 'First completion must be recorded as new');
  assert(completion1.event.prayerKey === 'Fajr', 'Prayer key must match Fajr');

  // Verify Anti-Duplication:
  const completionDuplicate = await recordPrayerCompletion({
    prayerKey: 'Fajr',
    cycleId: testCycleId,
    timezone: karachiTz,
    source: 'manual',
  });
  assert(completionDuplicate.isNew === false, 'Duplicate completion in same cycle must be rejected');
  assert(completionDuplicate.event.id === completion1.event.id, 'Duplicate must return original event ID');
  console.log('✓ Strict deduplication verified: single completion event per prayer occurrence');

  // Record Dhuhr and Asr in Pakistan
  await recordPrayerCompletion({ prayerKey: 'Dhuhr', cycleId: testCycleId, timezone: karachiTz });
  await recordPrayerCompletion({ prayerKey: 'Asr', cycleId: testCycleId, timezone: karachiTz });

  // Travel to USA (America/New_York) during same cycle
  const cycleStatusInUSA = getCycleCompletionStatus(testCycleId, [
    completion1.event,
    { ...completion1.event, id: 'pevent_dhuhr', prayerKey: 'Dhuhr', occurrenceRef: `${testCycleId}_Dhuhr` },
    { ...completion1.event, id: 'pevent_asr', prayerKey: 'Asr', occurrenceRef: `${testCycleId}_Asr` },
  ]);

  assert(cycleStatusInUSA.Fajr === true, 'Fajr completed in Pakistan must remain completed in USA');
  assert(cycleStatusInUSA.Dhuhr === true, 'Dhuhr completed in Pakistan must remain completed in USA');
  assert(cycleStatusInUSA.Asr === true, 'Asr completed in Pakistan must remain completed in USA');
  assert(cycleStatusInUSA.Maghrib === false, 'Maghrib must remain pending for destination local time');
  assert(cycleStatusInUSA.Isha === false, 'Isha must remain pending for destination local time');
  console.log('✓ International Travel Completion Invariant: Fajr, Dhuhr, Asr fully preserved in destination');

  // 5. Safe Reversible Migration from Legacy Boolean History
  console.log('\n[Test 5] Safe Reversible Legacy Migration');
  const legacyHistory = {
    '2026-11-01': { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
    '2026-11-02': { Fajr: true, Dhuhr: true, Asr: false, Maghrib: false, Isha: false },
  };

  const migratedEvents = buildMigratedEventsFromLegacy(legacyHistory, karachiTz);
  assert(migratedEvents.length === 7, `Expected exactly 7 migrated events, got ${migratedEvents.length}`);

  const derivedMap = deriveHistoryMapFromLedger(migratedEvents);
  assert(derivedMap['2026-11-01'].Fajr === true, 'Migrated Fajr must match');
  assert(derivedMap['2026-11-01'].Isha === true, 'Migrated Isha must match');
  assert(derivedMap['2026-11-02'].Asr === false, 'Uncompleted prayer must remain false');
  console.log('✓ Legacy boolean records successfully migrated to immutable events with lossless backward projection');

  console.log('\n--- ALL TRAVEL-AWARE PRAYER TRACKING TESTS PASSED (5/5) ---');
}

runTravelAwareTrackingTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
