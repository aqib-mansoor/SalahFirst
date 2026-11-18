package com.salahfirst.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

class AzanBootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        if (action == Intent.ACTION_BOOT_COMPLETED ||
            action == Intent.ACTION_LOCKED_BOOT_COMPLETED ||
            action == Intent.ACTION_MY_PACKAGE_REPLACED
        ) {
            try {
                val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                val canExact = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    am.canScheduleExactAlarms()
                } else {
                    true
                }
                val prefs = context.getSharedPreferences(AzanModule.PREFS_NAME, Context.MODE_PRIVATE)
                val now = System.currentTimeMillis()
                var restored = 0

                for (id in 0..69) {
                    val entry = prefs.getString("alarm_$id", null) ?: continue
                    val parts = entry.split("|")
                    if (parts.size < 3) continue
                    val prayerName = parts[0]
                    val reciterName = parts[1]
                    val triggerMs = parts[2].toLongOrNull() ?: continue
                    if (triggerMs <= now) continue

                    val receiverIntent = Intent(context, AzanReceiver::class.java).apply {
                        putExtra(AzanReceiver.EXTRA_RECITER, reciterName)
                        putExtra(AzanReceiver.EXTRA_PRAYER, prayerName)
                    }
                    val pi = PendingIntent.getBroadcast(
                        context,
                        id,
                        receiverIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    if (canExact && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        val showIntent = PendingIntent.getActivity(
                            context,
                            id + 1000,
                            context.packageManager.getLaunchIntentForPackage(context.packageName),
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )
                        am.setAlarmClock(AlarmManager.AlarmClockInfo(triggerMs, showIntent), pi)
                    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMs, pi)
                    } else {
                        am.set(AlarmManager.RTC_WAKEUP, triggerMs, pi)
                    }
                    restored++
                }
                Log.i("AzanBootReceiver", "Restored $restored upcoming prayer alarms after $action.")
            } catch (e: Exception) {
                Log.w("AzanBootReceiver", "Failed to restore alarms on boot: ${e.message}")
            }
        }
    }
}

