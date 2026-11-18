package com.salahfirst.app

import android.app.NotificationManager
import android.content.Context
import android.media.AudioManager
import android.os.Build
import android.util.Log

object DeviceSoundModeHelper {
    private const val TAG = "DeviceSoundModeHelper"

    data class SoundModeState(
        val ringerMode: Int,
        val isDndActive: Boolean,
        val canPlayAudibleSound: Boolean,
        val suppressionReason: String?
    )

    fun evaluateSoundMode(context: Context): SoundModeState {
        val am = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager

        val ringerMode = am?.ringerMode ?: AudioManager.RINGER_MODE_NORMAL
        var isDndActive = false
        var suppressionReason: String? = null

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && nm != null) {
            try {
                val filter = nm.currentInterruptionFilter
                if (filter == NotificationManager.INTERRUPTION_FILTER_NONE) {
                    isDndActive = true
                    suppressionReason = "Device DND active: Total silence (INTERRUPTION_FILTER_NONE)"
                } else if (filter == NotificationManager.INTERRUPTION_FILTER_PRIORITY) {
                    isDndActive = true
                    suppressionReason = "Device DND active: Priority only (INTERRUPTION_FILTER_PRIORITY)"
                }
            } catch (e: Exception) {
                Log.w(TAG, "Error checking interruptionFilter: ${e.message}")
            }
        }

        if (suppressionReason == null) {
            when (ringerMode) {
                AudioManager.RINGER_MODE_SILENT -> {
                    suppressionReason = "Device in Silent mode (RINGER_MODE_SILENT)"
                }
                AudioManager.RINGER_MODE_VIBRATE -> {
                    Log.i(TAG, "Device in Vibrate mode: Audible Azan permitted.")
                }
            }
        }

        val canPlay = suppressionReason == null
        if (!canPlay) {
            Log.i(TAG, "Audible playback suppressed: $suppressionReason")
        }

        return SoundModeState(
            ringerMode = ringerMode,
            isDndActive = isDndActive,
            canPlayAudibleSound = canPlay,
            suppressionReason = suppressionReason
        )
    }
}

