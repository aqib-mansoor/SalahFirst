package com.salahfirst.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.*

class AzanModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AzanModule"

    @ReactMethod
    fun canScheduleExactAlarms(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val am = ctx.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
            if (am == null) {
                promise.resolve(false)
                return
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                promise.resolve(am.canScheduleExactAlarms())
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun isIgnoringBatteryOptimizations(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val pm = ctx.getSystemService(Context.POWER_SERVICE) as? android.os.PowerManager
            if (pm != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                promise.resolve(pm.isIgnoringBatteryOptimizations(ctx.packageName))
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun requestIgnoreBatteryOptimizations(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent(android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = android.net.Uri.parse("package:${ctx.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                ctx.startActivity(intent)
                promise.resolve(true)
            } else {
                promise.resolve(false)
            }
        } catch (e: Exception) {
            try {
                val fallbackIntent = Intent(android.provider.Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactApplicationContext.startActivity(fallbackIntent)
                promise.resolve(true)
            } catch (fallbackErr: Exception) {
                promise.resolve(false)
            }
        }
    }

    @ReactMethod
    fun openExactAlarmSettings(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val intent = Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                    data = android.net.Uri.parse("package:${ctx.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                ctx.startActivity(intent)
                promise.resolve(true)
            } else {
                val intent = Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                    data = android.net.Uri.parse("package:${ctx.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                ctx.startActivity(intent)
                promise.resolve(true)
            }
        } catch (e: Exception) {
            try {
                val intent = Intent(android.provider.Settings.ACTION_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactApplicationContext.startActivity(intent)
                promise.resolve(true)
            } catch (fallbackErr: Exception) {
                promise.reject("SETTINGS_ERR", fallbackErr.message, fallbackErr)
            }
        }
    }

    @ReactMethod
    fun scheduleAzan(
        prayerName: String,
        reciterName: String,
        triggerAtMs: Double,
        alarmId: Int,
        promise: Promise
    ) {
        try {
            val ctx = reactApplicationContext
            val am  = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !am.canScheduleExactAlarms()) {
                promise.reject("EXACT_ALARM_PERMISSION_REVOKED", "SCHEDULE_EXACT_ALARM permission is revoked or disabled by system.")
                return
            }

            val intent = buildReceiverIntent(ctx, reciterName, prayerName)
            val pi = PendingIntent.getBroadcast(
                ctx, alarmId, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val triggerMs = triggerAtMs.toLong()
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val showIntent = PendingIntent.getActivity(
                    ctx,
                    alarmId + 1000,
                    ctx.packageManager.getLaunchIntentForPackage(ctx.packageName),
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                am.setAlarmClock(AlarmManager.AlarmClockInfo(triggerMs, showIntent), pi)
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMs, pi)
            } else {
                am.setExact(AlarmManager.RTC_WAKEUP, triggerMs, pi)
            }

            ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit()
                .putString("alarm_$alarmId", "$prayerName|$reciterName|$triggerMs")
                .apply()

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SCHEDULE_ERR", e.message, e)
        }
    }

    @ReactMethod
    fun cancelAzan(alarmId: Int, promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val am  = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val pi  = PendingIntent.getBroadcast(
                ctx, alarmId,
                buildReceiverIntent(ctx, "", ""),
                PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
            )
            pi?.let { am.cancel(it) }
            ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit()
                .remove("alarm_$alarmId")
                .apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CANCEL_ERR", e.message, e)
        }
    }

    @ReactMethod
    fun cancelAllAzans(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val am  = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit()
            for (id in 0..69) {
                val pi = PendingIntent.getBroadcast(
                    ctx, id,
                    buildReceiverIntent(ctx, "", ""),
                    PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
                )
                pi?.let { am.cancel(it) }
                prefs.remove("alarm_$id")
            }
            prefs.apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CANCEL_ALL_ERR", e.message, e)
        }
    }

    @ReactMethod
    fun stopAzan(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            ctx.stopService(Intent(ctx, AzanService::class.java))
            ctx.sendBroadcast(
                Intent(AzanService.ACTION_STOP_AZAN).setPackage(ctx.packageName)
            )
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_ERR", e.message, e)
        }
    }

    @ReactMethod
    fun getDeviceSoundMode(promise: Promise) {
        try {
            val state = DeviceSoundModeHelper.evaluateSoundMode(reactApplicationContext)
            val map = Arguments.createMap().apply {
                putInt("ringerMode", state.ringerMode)
                putBoolean("isDndActive", state.isDndActive)
                putBoolean("canPlayAudibleSound", state.canPlayAudibleSound)
                putString("suppressionReason", state.suppressionReason)
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("SOUND_MODE_ERR", e.message, e)
        }
    }

    @ReactMethod
    fun isAzanPlaying(promise: Promise) {
        promise.resolve(AzanService.isRunning)
    }

    /**
     * Start immediate native playback via AzanService (developer testing).
     */
    @ReactMethod
    fun playNativeAzanImmediate(reciterName: String, testLabel: String, promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val serviceIntent = Intent(ctx, AzanService::class.java).apply {
                putExtra(AzanService.EXTRA_RECITER, reciterName)
                putExtra(AzanService.EXTRA_PRAYER, testLabel)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ctx.startForegroundService(serviceIntent)
            } else {
                ctx.startService(serviceIntent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("PLAY_IMMEDIATE_ERR", e.message, e)
        }
    }

    /**
     * Schedule a developer test alarm (default 30s) using the production AlarmManager path.
     * Uses unique test alarm ID (9999) to completely isolate from production prayers (0..69).
     */
    @ReactMethod
    fun scheduleTestAzan(reciterName: String, delaySeconds: Int, promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val am  = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            val intent = buildReceiverIntent(ctx, reciterName, "[TEST] Azan Verification")
            val pi = PendingIntent.getBroadcast(
                ctx, TEST_ALARM_ID, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val triggerMs = System.currentTimeMillis() + (delaySeconds * 1000L)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val showIntent = PendingIntent.getActivity(
                    ctx,
                    TEST_ALARM_ID + 1000,
                    ctx.packageManager.getLaunchIntentForPackage(ctx.packageName),
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                am.setAlarmClock(AlarmManager.AlarmClockInfo(triggerMs, showIntent), pi)
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMs, pi)
            } else {
                am.setExact(AlarmManager.RTC_WAKEUP, triggerMs, pi)
            }

            promise.resolve(triggerMs.toDouble())
        } catch (e: Exception) {
            promise.reject("SCHEDULE_TEST_ERR", e.message, e)
        }
    }

    /**
     * Cancel only the developer test alarm (ID 9999), leaving production prayer alarms untouched.
     */
    @ReactMethod
    fun cancelTestAzan(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val am  = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val pi  = PendingIntent.getBroadcast(
                ctx, TEST_ALARM_ID,
                buildReceiverIntent(ctx, "", ""),
                PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
            )
            pi?.let { am.cancel(it) }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CANCEL_TEST_ERR", e.message, e)
        }
    }

    private fun buildReceiverIntent(ctx: Context, reciter: String, prayer: String): Intent =
        Intent(ctx, AzanReceiver::class.java).apply {
            putExtra(AzanService.EXTRA_RECITER, reciter)
            putExtra(AzanService.EXTRA_PRAYER, prayer)
        }

    companion object {
        const val TEST_ALARM_ID = 9999
        const val PREFS_NAME = "SalahFirstAzanAlarms"
    }
}
