package com.salahfirst.app

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.view.View
import android.view.WindowInsetsController
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SystemNavModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SystemNavModule"

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
}

