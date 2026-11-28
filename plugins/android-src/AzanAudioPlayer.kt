package com.salahfirst.app

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.MediaPlayer
import android.os.Build
import android.os.PowerManager
import android.util.Log

/**
 * Dedicated Native Audio Player for Azan & Prayer Chime.
 * Plays raw bundled audio assets on USAGE_ALARM stream with a temporary WakeLock and AudioFocus,
 * guaranteeing full uninterrupted playback across all Android devices (Samsung, Xiaomi, Pixel, etc.).
 */
object AzanAudioPlayer {
    private const val TAG = "AzanAudioPlayer"
    private const val WAKE_LOCK_TAG = "SalahFirst:AzanAudioPlayerWakeLock"
    private const val MAX_PLAYBACK_MS = 4 * 60 * 1000L // 4 minutes safety timeout

    @Volatile
    private var mediaPlayer: MediaPlayer? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private var audioManager: AudioManager? = null
    private var audioFocusRequest: AudioFocusRequest? = null

    @Volatile
    var isPlaying: Boolean = false
        private set

    @Synchronized
    fun play(
        context: Context,
        rawResName: String,
        onComplete: (() -> Unit)? = null
    ): Boolean {
        stop()

        val appCtx = context.applicationContext
        val resId = appCtx.resources.getIdentifier(rawResName, "raw", appCtx.packageName)
        if (resId == 0) {
            Log.e(TAG, "Audio asset not found in res/raw: $rawResName")
            return false
        }

        return try {
            val pm = appCtx.getSystemService(Context.POWER_SERVICE) as? PowerManager
            wakeLock = pm?.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, WAKE_LOCK_TAG)?.apply {
                setReferenceCounted(false)
                acquire(MAX_PLAYBACK_MS)
            }

            val attrs = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build()

            val am = appCtx.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
            audioManager = am
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && am != null) {
                val req = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                    .setAudioAttributes(attrs)
                    .build()
                audioFocusRequest = req
                am.requestAudioFocus(req)
            }

            val afd = appCtx.resources.openRawResourceFd(resId)
            val player = MediaPlayer()
            try {
                player.setWakeMode(appCtx, PowerManager.PARTIAL_WAKE_LOCK)
                player.setAudioAttributes(attrs)
                player.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                player.prepare()
            } finally {
                try {
                    afd.close()
                } catch (_: Exception) {}
            }

            player.setOnCompletionListener {
                Log.i(TAG, "Playback completed naturally for $rawResName")
                stop()
                onComplete?.invoke()
            }

            player.setOnErrorListener { _, what, extra ->
                Log.e(TAG, "MediaPlayer error: what=$what, extra=$extra")
                stop()
                false
            }

            player.start()
            mediaPlayer = player
            isPlaying = true
            Log.i(TAG, "Azan playback started on USAGE_ALARM stream for $rawResName")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start Azan playback: ${e.message}", e)
            stop()
            false
        }
    }

    @Synchronized
    fun stop() {
        isPlaying = false
        try {
            mediaPlayer?.let { player ->
                if (player.isPlaying) {
                    player.stop()
                }
                player.reset()
                player.release()
            }
        } catch (e: Exception) {
            Log.w(TAG, "Error stopping MediaPlayer: ${e.message}")
        } finally {
            mediaPlayer = null
        }

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                audioFocusRequest?.let { audioManager?.abandonAudioFocusRequest(it) }
            }
        } catch (_: Exception) {}
        audioFocusRequest = null
        audioManager = null

        try {
            if (wakeLock?.isHeld == true) {
                wakeLock?.release()
            }
        } catch (_: Exception) {}
        wakeLock = null
    }
}

