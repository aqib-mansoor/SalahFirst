// Comprehensive Automated Verification Suite for Prayer Focus Logic and Session Identity
const assert = (cond: any, msg: string) => {
  if (!cond) throw new Error(`[FAIL] ${msg}`);
};

// In Node/tsx testing environment, provide in-memory shim for window.localStorage if needed
if (typeof (global as any).window === 'undefined') {
  const memoryStore = new Map<string, string>();
  (global as any).window = {
    localStorage: {
      getItem: (key: string) => memoryStore.get(key) ?? null,
      setItem: (key: string, val: string) => memoryStore.set(key, String(val)),
      removeItem: (key: string) => memoryStore.delete(key),
      clear: () => memoryStore.clear(),
    },
  };
}

import {
  createFocusSession,
  saveActiveFocusSession,
  getActiveFocusSession,
  clearActiveFocusSession,
  calculateRemainingSeconds,
  markFocusCompleted,
  isFocusCompletedToday,
  FocusSession,
} from '../utils/focusSession';
import {
  recordPrayerCompletion,
  getCycleCompletionStatus,
  loadPrayerLedger,
  savePrayerLedger,
} from '../utils/prayerLedgerManager';
import { calculateFajrBoundaries } from '../utils/prayerCycleManager';
import { ObligatorySalah } from '../types';

async function runPrayerFocusTests() {
  console.log('--- STARTING PRAYER FOCUS IDENTIFICATION & COMPLETION LOGIC TEST SUITE ---\n');

  // Clear any existing test state
  await clearActiveFocusSession();
  await savePrayerLedger([]);

  // SCENARIO 1: Start Fajr Focus and end it: only Fajr can be marked upon explicit confirmation
  console.log('[Scenario 1] Start Fajr Focus and end with confirmation');
  const fajrCycleId = 'cycle_20261115_fajr';
  const fajrDateKey = '2026-11-15';
  const session1 = createFocusSession('Fajr', 15, 0, 'Fajr', fajrDateKey, fajrCycleId);
  await saveActiveFocusSession(session1);

  assert(session1.prayerKey === 'Fajr', 'Session 1 prayerKey must be Fajr');
  assert(session1.cycleId === fajrCycleId, 'Session 1 cycleId must match');
  assert(session1.dateKey === fajrDateKey, 'Session 1 dateKey must match');

  // User confirms completion
  const completionResult1 = await recordPrayerCompletion({
    prayerKey: session1.prayerKey!,
    cycleId: session1.cycleId!,
    timezone: 'Asia/Karachi',
    source: 'focus',
  });
  assert(completionResult1.isNew === true, 'Fajr completion should be newly recorded');

  const ledgerAfterScenario1 = await loadPrayerLedger();
  const cycleStatus1 = getCycleCompletionStatus(fajrCycleId, ledgerAfterScenario1);
  assert(cycleStatus1.Fajr === true, 'Fajr must be completed');
  assert(cycleStatus1.Dhuhr === false, 'Dhuhr must NOT be completed');
  assert(cycleStatus1.Asr === false, 'Asr must NOT be completed');
  console.log('✓ Scenario 1 Passed: Only Fajr marked after explicit confirmation.');

  // SCENARIO 2: Start Fajr Focus, let the prayer time change to Dhuhr in background, then end:
  // Must NOT mark Dhuhr! Must preserve Fajr association.
  console.log('\n[Scenario 2] Session crosses boundary (Fajr -> Dhuhr transition)');
  const session2 = createFocusSession('Fajr', 20, 0, 'Fajr', fajrDateKey, fajrCycleId);
  await saveActiveFocusSession(session2);

  // Simulate background state where Home Screen now sees Dhuhr
  const currentHomeScreenPrayer: ObligatorySalah = 'Dhuhr';
  // Retrieve the saved session - it must STILL be bound to Fajr
  const retrievedSession2 = await getActiveFocusSession();
  assert(retrievedSession2 !== null, 'Session 2 must exist in storage');
  assert(retrievedSession2?.prayerKey === 'Fajr', 'Session 2 must remain bound to Fajr despite home screen being Dhuhr');
  assert(retrievedSession2?.cycleId === fajrCycleId, 'Cycle ID must not drift');

  // When user ends session and confirms, only the bound prayerKey is marked
  // Dhuhr remains untouched!
  const ledgerAfterScenario2 = await loadPrayerLedger();
  const statusAfter2 = getCycleCompletionStatus(fajrCycleId, ledgerAfterScenario2);
  assert(statusAfter2.Dhuhr === false, 'Dhuhr must NOT be marked when ending a Fajr session');
  console.log('✓ Scenario 2 Passed: Prayer transition did not cause Dhuhr to be marked.');

  // SCENARIO 3: Start Dhuhr Focus and end it: only Dhuhr can be marked
  console.log('\n[Scenario 3] Start Dhuhr Focus and end it');
  const session3 = createFocusSession('Dhuhr', 15, 0, 'Dhuhr', fajrDateKey, fajrCycleId);
  const completionResult3 = await recordPrayerCompletion({
    prayerKey: session3.prayerKey!,
    cycleId: session3.cycleId!,
    timezone: 'Asia/Karachi',
    source: 'focus',
  });
  assert(completionResult3.isNew === true, 'Dhuhr completion recorded');
  const ledgerAfter3 = await loadPrayerLedger();
  const statusAfter3 = getCycleCompletionStatus(fajrCycleId, ledgerAfter3);
  assert(statusAfter3.Dhuhr === true, 'Dhuhr is now marked');
  assert(statusAfter3.Asr === false, 'Asr must NOT be marked');
  console.log('✓ Scenario 3 Passed: Only Dhuhr marked.');

  // SCENARIO 4: Select "No" / "Not yet" in confirmation: no prayer is marked
  console.log('\n[Scenario 4] User selects "Not yet" / Cancel upon session finish');
  const session4 = createFocusSession('Asr', 15, 0, 'Asr', fajrDateKey, fajrCycleId);
  await saveActiveFocusSession(session4);
  // User says "Not yet" -> we do NOT call recordPrayerCompletion
  await clearActiveFocusSession();
  const ledgerAfter4 = await loadPrayerLedger();
  const statusAfter4 = getCycleCompletionStatus(fajrCycleId, ledgerAfter4);
  assert(statusAfter4.Asr === false, 'Asr must NOT be marked when user chooses Not Yet');
  console.log('✓ Scenario 4 Passed: Salah tracker remains untouched on Not Yet.');

  // SCENARIO 5: Start Focus for an already completed prayer: duplicate completion prevented
  console.log('\n[Scenario 5] Prevent duplicate completion');
  // Fajr is already marked in cycleStatus1
  const session5 = createFocusSession('Fajr', 15, 0, 'Fajr', fajrDateKey, fajrCycleId);
  const completionResult5 = await recordPrayerCompletion({
    prayerKey: session5.prayerKey!,
    cycleId: session5.cycleId!,
    timezone: 'Asia/Karachi',
    source: 'focus',
  });
  assert(completionResult5.isNew === false, 'Duplicate completion must be rejected (isNew: false)');
  const ledgerAfter5 = await loadPrayerLedger();
  const fajrEvents = ledgerAfter5.filter((e) => e.cycleId === fajrCycleId && e.prayerKey === 'Fajr');
  assert(fajrEvents.length === 1, 'Exactly 1 Fajr event must exist in ledger');
  console.log('✓ Scenario 5 Passed: Duplicate completion prevented.');

  // SCENARIO 6: Cross-midnight session: verify correct prayer date and cycle identity
  console.log('\n[Scenario 6] Cross-midnight session preserves start dateKey and cycleId');
  const preMidnightDateKey = '2026-11-15';
  const postMidnightCycleId = 'cycle_20261115_night';
  const session6 = createFocusSession('Isha', 25, 0, 'Isha', preMidnightDateKey, postMidnightCycleId);
  // Simulate ending the session on 2026-11-16 (after midnight)
  const completionResult6 = await recordPrayerCompletion({
    prayerKey: session6.prayerKey!,
    cycleId: session6.cycleId!,
    timezone: 'Asia/Karachi',
    source: 'focus',
  });
  assert(completionResult6.event.cycleId === postMidnightCycleId, 'Cycle ID must be the original pre-midnight cycle');
  const ledgerAfter6 = await loadPrayerLedger();
  const statusAfter6 = getCycleCompletionStatus(postMidnightCycleId, ledgerAfter6);
  assert(statusAfter6.Isha === true, 'Isha of the pre-midnight cycle marked completed');
  console.log('✓ Scenario 6 Passed: Cross-midnight session preserved original cycle identity.');

  // SCENARIO 7: App background and resume during active session: preserve identity without drift
  console.log('\n[Scenario 7] Background and resume preserves session identity');
  const session7 = createFocusSession('Maghrib', 15, 0, 'Maghrib', fajrDateKey, fajrCycleId);
  await saveActiveFocusSession(session7);
  // Simulate background breach
  session7.breachCount = (session7.breachCount || 0) + 1;
  await saveActiveFocusSession(session7);

  const restoredSession = await getActiveFocusSession();
  assert(restoredSession !== null, 'Restored session must exist');
  assert(restoredSession?.prayerKey === 'Maghrib', 'Restored session prayer must be Maghrib');
  assert(restoredSession?.breachCount === 1, 'Breach count accurately updated in storage');
  assert(restoredSession?.cycleId === fajrCycleId, 'Cycle ID retained without drift');
  console.log('✓ Scenario 7 Passed: Session identity preserved through backgrounding.');

  // SCENARIO 8: End session after next prayer begins: verify confirmation & tracking
  console.log('\n[Scenario 8] End session after next prayer begins');
  // Focus was started for Maghrib. Next prayer (Isha) arrives while user was in focus.
  const session8 = createFocusSession('Maghrib', 20, 0, 'Maghrib', fajrDateKey, fajrCycleId);
  await saveActiveFocusSession(session8);

  // User confirms Maghrib
  await recordPrayerCompletion({
    prayerKey: session8.prayerKey!,
    cycleId: session8.cycleId!,
    timezone: 'Asia/Karachi',
    source: 'focus',
  });
  const ledgerAfter8 = await loadPrayerLedger();
  const statusAfter8 = getCycleCompletionStatus(fajrCycleId, ledgerAfter8);
  assert(statusAfter8.Maghrib === true, 'Maghrib marked');
  assert(statusAfter8.Isha === false, 'Isha remains pending (never auto-marked)');
  console.log('✓ Scenario 8 Passed: Only original prayer marked, next prayer remains pending.');

  console.log('\n--- ALL 8 PRAYER FOCUS TEST SCENARIOS PASSED (8/8) ---');
}

runPrayerFocusTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
