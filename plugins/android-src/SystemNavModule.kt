package com.salahfirst.app

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.view.View
import android.view.WindowInsetsController
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SystemNavModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var pendingSavePromise: Promise? = null
    private var pendingSaveContent: String? = null
    private var pendingPickPromise: Promise? = null

    private val activityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(
            activity: Activity,
            requestCode: Int,
            resultCode: Int,
            data: Intent?
        ) {
            if (requestCode == REQ_CREATE_BACKUP_FILE) {
                val promise = pendingSavePromise
                val content = pendingSaveContent
                pendingSavePromise = null
                pendingSaveContent = null
                if (promise == null) return

                val uri: Uri? = data?.data
                if (resultCode != Activity.RESULT_OK || uri == null || content == null) {
                    promise.resolve(false)
                    return
                }
                try {
                    reactContext.contentResolver.openOutputStream(uri, "wt")?.use { out ->
                        out.write(content.toByteArray(Charsets.UTF_8))
                        out.flush()
                    }
                    promise.resolve(true)
                } catch (e: Exception) {
                    promise.reject("SAVE_FILE_ERR", e.message, e)
                }
            } else if (requestCode == REQ_PICK_BACKUP_FILE) {
                val promise = pendingPickPromise
                pendingPickPromise = null
                if (promise == null) return

                val uri: Uri? = data?.data
                if (resultCode != Activity.RESULT_OK || uri == null) {
                    promise.resolve(null)
                    return
                }
                try {
                    val text = reactContext.contentResolver.openInputStream(uri)?.use { input ->
                        input.bufferedReader(Charsets.UTF_8).readText()
                    }
                    promise.resolve(text)
                } catch (e: Exception) {
                    promise.reject("PICK_FILE_ERR", e.message, e)
                }
            }
        }
    }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName(): String = "SystemNavModule"

    @ReactMethod
    fun saveBackupJsonFile(fileName: String, jsonContent: String, promise: Promise) {
        val activity = reactContext.currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }
        try {
            pendingSavePromise = promise
            pendingSaveContent = jsonContent
            val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "application/json"
                putExtra(Intent.EXTRA_TITLE, fileName)
            }
            activity.startActivityForResult(intent, REQ_CREATE_BACKUP_FILE)
        } catch (e: Exception) {
            pendingSavePromise = null
            pendingSaveContent = null
            promise.reject("SAVE_LAUNCH_ERR", e.message, e)
        }
    }

    @ReactMethod
    fun pickBackupJsonFile(promise: Promise) {
        val activity = reactContext.currentActivity
        if (activity == null) {
            promise.resolve(null)
            return
        }
        try {
            pendingPickPromise = promise
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "*/*"
                putExtra(
                    Intent.EXTRA_MIME_TYPES,
                    arrayOf("application/json", "text/plain", "application/octet-stream")
                )
            }
            activity.startActivityForResult(intent, REQ_PICK_BACKUP_FILE)
        } catch (e: Exception) {
            pendingPickPromise = null
            promise.reject("PICK_LAUNCH_ERR", e.message, e)
        }
    }

    @ReactMethod
    fun setNavigationBarTheme(isDark: Boolean, hexColor: String) {
        val activity: Activity? = reactContext.currentActivity
        if (activity == null || Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        activity.runOnUiThread {
            try {
                val window = activity.window
                val parsedColor = Color.parseColor(hexColor)
                window.navigationBarColor = parsedColor

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    val controller = window.insetsController
                    if (controller != null) {
                        if (isDark) {
                            controller.setSystemBarsAppearance(
                                0,
                                WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
                            )
                        } else {
                            controller.setSystemBarsAppearance(
                                WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
                                WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
                            )
                        }
                    }
                } else {
                    @Suppress("DEPRECATION")
                    var flags = window.decorView.systemUiVisibility
                    flags = if (isDark) {
                        flags and View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR.inv()
                    } else {
                        flags or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
                    }
                    window.decorView.systemUiVisibility = flags
                }
            } catch (_: Exception) {}
        }
    }

    companion object {
        private const val REQ_CREATE_BACKUP_FILE = 9401
        private const val REQ_PICK_BACKUP_FILE = 9402
    }
}
