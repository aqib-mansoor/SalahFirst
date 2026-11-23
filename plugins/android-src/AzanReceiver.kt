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
 * channels and hardware vibration. Audio is played via native AzanAudioPlayer on USAGE_ALARM stream.
 */
class AzanReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == ACTION_STOP_AZAN) {
            Log.i(TAG, "ACTION_STOP_AZAN received. Stopping audio and cancelling notification.")
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
        private const val AUDIBLE_CHANNEL_ID = "salahfirst-azan-alarm-v4"
        private val VIBRATE_PATTERN = longArrayOf(0, 600, 300, 600, 300, 600)

        @Volatile
        var isPlaying: Boolean = false
            private set

        fun cancelAzanNotification(context: Context) {
            isPlaying = false
            AzanAudioPlayer.stop()
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            nm?.cancel(NOTIFICATION_ID)
        }

        private fun triggerHardwareVibration(context: Context) {
            try {
                val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                    nm?.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_NONE
                ) return
                @Suppress("DEPRECATION")
                val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    (context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager)?.defaultVibrator
                } else {
                    context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                }
                if (vibrator?.hasVibrator() == true) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator.vibrate(VibrationEffect.createWaveform(VIBRATE_PATTERN, -1))
                    } else {
                        vibrator.vibrate(VIBRATE_PATTERN, -1)
                    }
                }
            } catch (_: Exception) {}
        }

        private fun ensureChannel(
            nm: NotificationManager,
            id: String,
            name: String,
            soundUri: Uri?,
            vibrate: Boolean
        ) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && nm.getNotificationChannel(id) == null) {
                val channel = NotificationChannel(id, name, NotificationManager.IMPORTANCE_HIGH).apply {
                    lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                    enableVibration(vibrate)
                    if (vibrate) vibrationPattern = VIBRATE_PATTERN
                    if (soundUri != null) {
                        val attrs = AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .setFlags(AudioAttributes.FLAG_AUDIBILITY_ENFORCED)
                            .build()
                        setSound(soundUri, attrs)
                    } else {
                        setSound(null, null)
                    }
                }
                nm.createNotificationChannel(channel)
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

            // 1. VIBRATE Mode: Hardware vibration + visual banner
            if (isVibrate) {
                triggerHardwareVibration(context)
                ensureChannel(nm, VIBRATE_CHANNEL_ID, "Prayer Alert (Vibrate Only)", null, true)
                val notif = NotificationCompat.Builder(context, VIBRATE_CHANNEL_ID)
                    .setSmallIcon(R.drawable.notification_icon)
                    .setContentTitle(texts.title)
                    .setContentText(texts.shortBody)
                    .setSubText(texts.subText)
                    .setStyle(NotificationCompat.BigTextStyle().setBigContentTitle(texts.title).bigText(texts.bigBody))
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setContentIntent(openIntent)
                    .setAutoCancel(true)
                    .setVibrate(VIBRATE_PATTERN)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                    .addAction(0, texts.prayedAction, markPrayedIntent)
                    .build()
                nm.notify(NOTIFICATION_ID, notif)
                return
            }

            // 2. Silent & DND Check: If device is in Silent mode or DND, stay silent
            val fajrOverride = prefs.getBoolean(AzanModule.KEY_FAJR_OVERRIDE, true)
            val isFajrPrayer = prayer.equals("Fajr", ignoreCase = true)
            val isTotalSilence = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                nm.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_NONE
            val allowFajrWakeUp = isFajrPrayer && fajrOverride && !isTotalSilence

            if (!soundState.canPlayAudibleSound && !allowFajrWakeUp) {
                Log.i(TAG, "Device in Silent or DND mode (${soundState.suppressionReason}). Posting silent notice.")
                ensureChannel(nm, SILENT_CHANNEL_ID, "Prayer Call (Silent Mode)", null, true)
                val silentNotif = NotificationCompat.Builder(context, SILENT_CHANNEL_ID)
                    .setSmallIcon(R.drawable.notification_icon)
                    .setContentTitle(texts.title)
                    .setContentText(texts.shortBody)
                    .setSubText(texts.subText)
                    .setStyle(NotificationCompat.BigTextStyle().setBigContentTitle(texts.title).bigText(texts.bigBody))
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

            // 3. AUDIBLE Mode (AZAN & TONE): Play full audio recitation via system channel
            val rawName = when (reciter) {
                "tone"    -> "prayer_tone"
                "madinah" -> "azan_madinah"
                "alAqsa"  -> "azan_alaqsa"
                "alafasy" -> "azan_alafasy"
                "fajr"    -> "azan_fajr"
                "qatami"  -> "azan_qatami"
                else      -> "azan_makkah"
            }

            val channelId = "salahfirst-azan-alarm-${rawName}-v6"
            val soundUri = Uri.parse(
                "${ContentResolver.SCHEME_ANDROID_RESOURCE}://${context.packageName}/raw/$rawName"
            )
            ensureChannel(nm, channelId, "Prayer Azan Alarm", soundUri, true)

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
                .setFullScreenIntent(openIntent, true)
                .setAutoCancel(isTone)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setSound(soundUri, AudioManager.STREAM_ALARM)

            if (isAzan) {
                builder.addAction(android.R.drawable.ic_media_pause, texts.silenceAction, stopIntent)
            }

            isPlaying = true
            nm.notify(NOTIFICATION_ID, builder.build())
            Log.i(TAG, "Audible prayer alert posted on $channelId for $prayer with $rawName recitation.")
        }
    }
}
