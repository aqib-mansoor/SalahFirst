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
import android.util.Log
import androidx.core.app.NotificationCompat

/**
 * Woken by AlarmManager at exact prayer time — even when app is killed or device is in Doze mode.
 * Posts a high-priority CATEGORY_ALARM notification on per-reciter USAGE_ALARM channels
 * using stable resource-name URIs so Play Store updates never break cached channel sounds.
 * Strictly respects Silent and DND modes via DeviceSoundModeHelper.
 */
class AzanReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == ACTION_STOP_AZAN) {
            Log.i(TAG, "ACTION_STOP_AZAN received. Cancelling active Azan notification.")
            cancelAzanNotification(context)
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
        const val EXTRA_RECITER = "reciter"
        const val EXTRA_PRAYER = "prayer"
        private const val SILENT_CHANNEL_ID = "salahfirst-azan-silent-v3"

        @Volatile
        var isPlaying: Boolean = false
            private set

        fun cancelAzanNotification(context: Context) {
            isPlaying = false
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            nm?.cancel(NOTIFICATION_ID)
        }

        fun postAzanNotification(context: Context, prayer: String, reciter: String) {
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager ?: return
            val soundState = DeviceSoundModeHelper.evaluateSoundMode(context)

            val openIntent = PendingIntent.getActivity(
                context,
                2001,
                context.packageManager.getLaunchIntentForPackage(context.packageName),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )

            // Strictly respect Silent and DND modes: post silent visual notification only
            if (!soundState.canPlayAudibleSound) {
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
                val silentNotif = NotificationCompat.Builder(context, SILENT_CHANNEL_ID)
                    .setSmallIcon(R.drawable.notification_icon)
                    .setContentTitle("$prayer • Hayya 'alas-Salah")
                    .setContentText("It is time for $prayer prayer.")
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setContentIntent(openIntent)
                    .setAutoCancel(true)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                    .build()
                nm.notify(NOTIFICATION_ID, silentNotif)
                return
            }

            val (channelId, channelName, rawName) = when (reciter) {
                "madinah" -> Triple("salahfirst-azan-alarm-madinah-v3", "Prayer Azan Alarm (Madinah)", "azan_madinah")
                "alAqsa"  -> Triple("salahfirst-azan-alarm-alaqsa-v3", "Prayer Azan Alarm (Al-Aqsa)", "azan_alaqsa")
                else      -> Triple("salahfirst-azan-alarm-makkah-v3", "Prayer Azan Alarm (Makkah)", "azan_makkah")
            }

            // Use resource name URI instead of integer resId so app updates never break cached channels
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
                    description = "Exact prayer time Azan recitation on the Alarm audio stream"
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

            val notification = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle("$prayer • Hayya 'alas-Salah")
                .setContentText("It is time for $prayer prayer. Tap Stop Azan to silence.")
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setContentIntent(openIntent)
                .setAutoCancel(false)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setSound(soundUri, AudioManager.STREAM_ALARM)
                .addAction(android.R.drawable.ic_media_pause, "Stop Azan", stopIntent)
                .build()

            isPlaying = true
            nm.notify(NOTIFICATION_ID, notification)
            Log.i(TAG, "Audible Azan alarm notification posted on $channelId for $prayer.")
        }
    }
}

