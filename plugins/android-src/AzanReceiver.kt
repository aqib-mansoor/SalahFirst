package com.salahfirst.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log
import androidx.core.app.NotificationCompat

/**
 * Woken by AlarmManager at exact prayer time — even when app is killed or device is in Doze mode.
 * Handles AZAN (makkah/madinah/alAqsa), TONE (prayer_tone), and VIBRATE modes with dedicated
 * channels and hardware vibration. Strictly respects Silent and DND modes.
 */
class AzanReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == ACTION_STOP_AZAN) {
            Log.i(TAG, "ACTION_STOP_AZAN received. Cancelling active Azan notification.")
            cancelAzanNotification(context)
            return
        }
        if (intent.action == ACTION_MARK_PRAYED) {
            val prayerName = intent.getStringExtra(EXTRA_PRAYER) ?: "Fajr"
            Log.i(TAG, "ACTION_MARK_PRAYED received for $prayerName.")
            cancelAzanNotification(context)
            context.getSharedPreferences(AzanModule.PREFS_NAME, Context.MODE_PRIVATE).edit()
                .putString(AzanModule.KEY_PENDING_PRAYED, prayerName)
                .apply()
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            }
            if (launchIntent != null) {
                try {
                    context.startActivity(launchIntent)
                } catch (_: Exception) {}
            }
            return
        }

        val reciter = intent.getStringExtra(EXTRA_RECITER) ?: "makkah"
        val prayer = intent.getStringExtra(EXTRA_PRAYER) ?: "Prayer"
        Log.i(TAG, "AzanReceiver onReceive() fired for prayer=$prayer reciter=$reciter")

        val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
        val wl = pm?.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "SalahFirst:AzanReceiverWakeLock")
        try {
            wl?.acquire(10 * 1000L)
            postAzanNotification(context, prayer, reciter)
        } catch (e: Exception) {
            Log.e(TAG, "AzanReceiver error: ${e.message}", e)
        } finally {
            try {
                if (wl != null && wl.isHeld) wl.release()
            } catch (_: Exception) {}
        }
    }

    companion object {
        private const val TAG = "AzanReceiver"
        const val NOTIFICATION_ID = 7777
        const val ACTION_STOP_AZAN = "com.salahfirst.app.STOP_AZAN"
        const val ACTION_MARK_PRAYED = "com.salahfirst.app.MARK_PRAYED"
        const val EXTRA_RECITER = "reciter"
        const val EXTRA_PRAYER = "prayer"
        private const val SILENT_CHANNEL_ID = "salahfirst-azan-silent-v3"
        private const val VIBRATE_CHANNEL_ID = "salahfirst-prayer-vibrate-v3"
        private val VIBRATE_PATTERN = longArrayOf(0, 600, 300, 600, 300, 600)

        @Volatile
        var isPlaying: Boolean = false
            private set

        fun cancelAzanNotification(context: Context) {
            isPlaying = false
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            nm?.cancel(NOTIFICATION_ID)
        }

        private fun triggerHardwareVibration(context: Context) {
            try {
                val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                    nm?.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_NONE
                ) {
                    return
                }
                val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                    vm?.defaultVibrator
                } else {
                    @Suppress("DEPRECATION")
                    context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                }
                if (vibrator?.hasVibrator() == true) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator.vibrate(VibrationEffect.createWaveform(VIBRATE_PATTERN, -1))
                    } else {
                        @Suppress("DEPRECATION")
                        vibrator.vibrate(VIBRATE_PATTERN, -1)
                    }
                }
            } catch (e: Exception) {
                Log.w(TAG, "Hardware vibration warning: ${e.message}")
            }
        }

        fun postAzanNotification(context: Context, prayer: String, reciter: String) {
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager ?: return
            val soundState = DeviceSoundModeHelper.evaluateSoundMode(context)

            val prefs = context.getSharedPreferences(AzanModule.PREFS_NAME, Context.MODE_PRIVATE)
            val lang = prefs.getString("app_language", null) ?: java.util.Locale.getDefault().language
            val isTone = reciter == "tone"
            val isVibrate = reciter == "vibrate"
            val isAzan = !isTone && !isVibrate
            val texts = PrayerNotificationContent.get(prayer, lang, isAzan)

            val openIntent = PendingIntent.getActivity(
                context,
                2001,
                context.packageManager.getLaunchIntentForPackage(context.packageName),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )

            val markPrayedIntent = PendingIntent.getBroadcast(
                context,
                2003,
                Intent(context, AzanReceiver::class.java).apply {
                    action = ACTION_MARK_PRAYED
                    putExtra(EXTRA_PRAYER, prayer)
                },
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )

            // 1. VIBRATE Mode: Always vibrate (unless Total Silence DND) + visual banner
            if (isVibrate) {
                triggerHardwareVibration(context)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && nm.getNotificationChannel(VIBRATE_CHANNEL_ID) == null) {
                    val ch = NotificationChannel(
                        VIBRATE_CHANNEL_ID,
                        "Prayer Alert (Vibrate Only)",
                        NotificationManager.IMPORTANCE_HIGH
                    ).apply {
                        description = "Prayer time vibration alert without audio"
                        setSound(null, null)
                        enableVibration(true)
                        vibrationPattern = VIBRATE_PATTERN
                        lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                    }
                    nm.createNotificationChannel(ch)
                }
                val vibrateBigStyle = NotificationCompat.BigTextStyle()
                    .setBigContentTitle(texts.title)
                    .setSummaryText(texts.subText)
                    .bigText(texts.bigBody)

                val vibrateNotif = NotificationCompat.Builder(context, VIBRATE_CHANNEL_ID)
                    .setSmallIcon(R.drawable.notification_icon)
                    .setContentTitle(texts.title)
                    .setContentText(texts.shortBody)
                    .setSubText(texts.subText)
                    .setStyle(vibrateBigStyle)
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setContentIntent(openIntent)
                    .setAutoCancel(true)
                    .setVibrate(VIBRATE_PATTERN)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                    .addAction(0, texts.prayedAction, markPrayedIntent)
                    .build()
                nm.notify(NOTIFICATION_ID, vibrateNotif)
                return
            }

            // 2. Strictly respect Silent and DND modes for audible modes (AZAN & TONE),
            // except when Fajr Wake-Up Override is enabled and device is not in Total Silence DND.
            val fajrOverride = prefs.getBoolean(AzanModule.KEY_FAJR_OVERRIDE, true)
            val isFajrPrayer = prayer.equals("Fajr", ignoreCase = true)
            val isTotalSilence = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                nm.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_NONE
            val allowFajrWakeUp = isFajrPrayer && fajrOverride && !isTotalSilence

            if (!soundState.canPlayAudibleSound && !allowFajrWakeUp) {
                Log.i(TAG, "Silent notice posted (${soundState.suppressionReason})")
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && nm.getNotificationChannel(SILENT_CHANNEL_ID) == null) {
                    val ch = NotificationChannel(
                        SILENT_CHANNEL_ID,
                        "Prayer Call (Silent Mode)",
                        NotificationManager.IMPORTANCE_HIGH
                    ).apply {
                        description = "Visual prayer alert when phone is on Silent or DND"
                        setSound(null, null)
                        enableVibration(true)
                    }
                    nm.createNotificationChannel(ch)
                }
                val silentBigStyle = NotificationCompat.BigTextStyle()
                    .setBigContentTitle(texts.title)
                    .setSummaryText(texts.subText)
                    .bigText(texts.bigBody)

                val silentNotif = NotificationCompat.Builder(context, SILENT_CHANNEL_ID)
                    .setSmallIcon(R.drawable.notification_icon)
                    .setContentTitle(texts.title)
                    .setContentText(texts.shortBody)
                    .setSubText(texts.subText)
                    .setStyle(silentBigStyle)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setContentIntent(openIntent)
                    .setAutoCancel(true)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                    .addAction(0, texts.prayedAction, markPrayedIntent)
                    .build()
                nm.notify(NOTIFICATION_ID, silentNotif)
                return
            }

            val (channelId, channelName, rawName) = when (reciter) {
                "tone"    -> Triple("salahfirst-prayer-tone-v3", "Prayer Alert (Chime Tone)", "prayer_tone")
                "madinah" -> Triple("salahfirst-azan-alarm-madinah-v3", "Prayer Azan Alarm (Madinah)", "azan_madinah")
                "alAqsa"  -> Triple("salahfirst-azan-alarm-alaqsa-v3", "Prayer Azan Alarm (Al-Aqsa)", "azan_alaqsa")
                else      -> Triple("salahfirst-azan-alarm-makkah-v3", "Prayer Azan Alarm (Makkah)", "azan_makkah")
            }

            val soundUri = Uri.parse(
                "${ContentResolver.SCHEME_ANDROID_RESOURCE}://${context.packageName}/raw/$rawName"
            )

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && nm.getNotificationChannel(channelId) == null) {
                val audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setFlags(AudioAttributes.FLAG_AUDIBILITY_ENFORCED)
                    .build()

                val channel = NotificationChannel(
                    channelId,
                    channelName,
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Exact prayer time alert on the Alarm audio stream"
                    setSound(soundUri, audioAttributes)
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 500, 250, 500)
                    lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                }
                nm.createNotificationChannel(channel)
            }

            val stopIntent = PendingIntent.getBroadcast(
                context,
                2002,
                Intent(context, AzanReceiver::class.java).apply { action = ACTION_STOP_AZAN },
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )

            val bigStyle = NotificationCompat.BigTextStyle()
                .setBigContentTitle(texts.title)
                .setSummaryText(texts.subText)
                .bigText(texts.bigBody)

            val builder = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(texts.title)
                .setContentText(texts.shortBody)
                .setSubText(texts.subText)
                .setStyle(bigStyle)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setContentIntent(openIntent)
                .setAutoCancel(isTone)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setSound(soundUri, AudioManager.STREAM_ALARM)

            if (isAzan) {
                builder.addAction(android.R.drawable.ic_media_pause, texts.silenceAction, stopIntent)
                isPlaying = true
            }
            builder.addAction(0, texts.prayedAction, markPrayedIntent)

            nm.notify(NOTIFICATION_ID, builder.build())
            Log.i(TAG, "Audible prayer notification posted on $channelId for $prayer.")
        }
    }
}
