package com.salahfirst.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FocusSilencerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val audioManager =
        reactContext.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    private val notificationManager =
        reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager

    companion object {
        private var previousRingerMode: Int? = null
        private const val FOCUS_CHANNEL_ID = "salahfirst-focus-live"
        private const val FOCUS_NOTIFICATION_ID = 8842
    }

    override fun getName(): String = "FocusSilencerModule"

    private fun ensureChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                FOCUS_CHANNEL_ID,
                "Salah Focus Sanctuary",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Live Salah countdown with Quran & Hadith reflections"
                setShowBadge(false)
                enableVibration(false)
                setSound(null, null)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }
            notificationManager?.createNotificationChannel(channel)
        }
    }

    @ReactMethod
    fun enableFocusSilence(promise: Promise) {
        val am = audioManager
        if (am == null) {
            promise.resolve(false)
            return
        }

        try {
            if (previousRingerMode == null) {
                previousRingerMode = am.ringerMode
            }
            am.ringerMode = AudioManager.RINGER_MODE_VIBRATE
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun restoreFocusSilence(promise: Promise) {
        val am = audioManager
        try {
            notificationManager?.cancel(FOCUS_NOTIFICATION_ID)
            if (am != null) {
                val targetMode = previousRingerMode ?: AudioManager.RINGER_MODE_NORMAL
                am.ringerMode = targetMode
                previousRingerMode = null
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun showLiveFocusNotification(
        prayerName: String,
        targetEndEpochMs: Double,
        totalDurationMinutes: Double,
        remainingMinutes: Double,
        titleBadge: String,
        bodyText: String,
        promise: Promise
    ) {
        try {
            ensureChannel()
            val nm = notificationManager ?: run {
                promise.resolve(false)
                return
            }

            val totalMins = totalDurationMinutes.toInt().coerceAtLeast(1)
            val remMins = kotlin.math.ceil(remainingMinutes).toInt().coerceAtLeast(1)
            val elapsedMins = (totalMins - remainingMinutes.toInt()).coerceIn(0, totalMins)
            val reflectionLabel = if (titleBadge.equals("QURAN", ignoreCase = true)) {
                "Quranic Reflection"
            } else {
                "Prophetic Hadith"
            }

            val openIntent = reactContext.packageManager
                .getLaunchIntentForPackage(reactContext.packageName)
                ?.apply {
                    flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
                }
            val pendingFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            val contentPendingIntent = openIntent?.let {
                PendingIntent.getActivity(reactContext, FOCUS_NOTIFICATION_ID, it, pendingFlags)
            }

            val builder = NotificationCompat.Builder(reactContext, FOCUS_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setSubText("${remMins}m left • Phone Silenced")
                .setContentTitle("$prayerName Focus • $reflectionLabel")
                .setContentText(bodyText.lines().firstOrNull() ?: "")
                .setStyle(NotificationCompat.BigTextStyle().bigText(bodyText))
                .setShowWhen(false)
                .setUsesChronometer(false)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setProgress(totalMins, elapsedMins, false)
                .setPriority(NotificationCompat.PRIORITY_LOW)

            if (contentPendingIntent != null) {
                builder.setContentIntent(contentPendingIntent)
            }

            nm.notify(FOCUS_NOTIFICATION_ID, builder.build())
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun dismissLiveFocusNotification(promise: Promise) {
        try {
            notificationManager?.cancel(FOCUS_NOTIFICATION_ID)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun getCurrentRingerMode(promise: Promise) {
        val am = audioManager
        val mode = am?.ringerMode ?: AudioManager.RINGER_MODE_NORMAL
        val map = Arguments.createMap().apply {
            putInt("mode", mode)
            putBoolean("isVibrate", mode == AudioManager.RINGER_MODE_VIBRATE)
            putBoolean("isSilent", mode == AudioManager.RINGER_MODE_SILENT)
            putBoolean("isNormal", mode == AudioManager.RINGER_MODE_NORMAL)
        }
        promise.resolve(map)
    }
}

