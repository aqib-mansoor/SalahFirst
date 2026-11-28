const fs = require('fs');
const path = require('path');
const {
  withAndroidManifest,
  withMainApplication,
  withDangerousMod,
} = require('expo/config-plugins');

const KOTLIN_FILES = [
  'AzanAudioPlayer.kt',
  'AzanBootReceiver.kt',
  'AzanModule.kt',
  'AzanPackage.kt',
  'AzanReceiver.kt',
  'DeviceSoundModeHelper.kt',
  'FocusSilencerModule.kt',
  'FocusSilencerPackage.kt',
  'PrayerNotificationContent.kt',
  'SystemNavModule.kt',
  'SystemNavPackage.kt',
];

const AUDIO_FILES = [
  'azan_makkah.mp3',
  'azan_madinah.mp3',
  'azan_alaqsa.mp3',
  'azan_alafasy.mp3',
  'azan_fajr.mp3',
  'azan_qatami.mp3',
  'prayer_tone.wav',
];

function withSalahFirstManifest(config) {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    if (!manifest.$) manifest.$ = {};
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    const mainApp = manifest.application?.[0];
    if (!mainApp) return mod;

    const blockedPerms = [
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_AUDIO',
      'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
      'android.permission.ACTIVITY_RECOGNITION',
    ];

    if (!Array.isArray(manifest['uses-permission'])) {
      manifest['uses-permission'] = [];
    }

    // Remove existing entries for blocked permissions and replace with tools:node="remove"
    // so Gradle Manifest Merger strips them even if sub-libraries (like expo-media-library) declare them
    manifest['uses-permission'] = manifest['uses-permission'].filter((perm) => {
      const name = perm.$?.['android:name'] || '';
      return !blockedPerms.includes(name);
    });

    for (const permName of blockedPerms) {
      manifest['uses-permission'].push({
        $: {
          'android:name': permName,
          'tools:node': 'remove',
        },
      });
    }

    // Mark implicit hardware features (like screen.portrait from orientation="portrait" and location)
    // as required="false" so Google Play Console does not block review for Tablet/Foldable/Chromebook/XR
    const optionalFeatures = [
      'android.hardware.screen.portrait',
      'android.hardware.screen.landscape',
      'android.hardware.location',
      'android.hardware.location.gps',
      'android.hardware.location.network',
      'android.hardware.sensor.compass',
    ];

    if (!Array.isArray(manifest['uses-feature'])) {
      manifest['uses-feature'] = [];
    }

    manifest['uses-feature'] = manifest['uses-feature'].filter((feat) => {
      const name = feat.$?.['android:name'] || '';
      return !optionalFeatures.includes(name);
    });

    for (const featName of optionalFeatures) {
      manifest['uses-feature'].push({
        $: {
          'android:name': featName,
          'android:required': 'false',
        },
      });
    }

    // Remove legacy AzanService if present
    if (Array.isArray(mainApp.service)) {
      mainApp.service = mainApp.service.filter(
        (s) => s.$?.['android:name'] !== '.AzanService'
      );
    }

    if (!Array.isArray(mainApp.receiver)) {
      mainApp.receiver = [];
    }

    // Remove existing entries to avoid duplicates on re-runs
    mainApp.receiver = mainApp.receiver.filter(
      (r) =>
        r.$?.['android:name'] !== '.AzanReceiver' &&
        r.$?.['android:name'] !== '.AzanBootReceiver'
    );

    mainApp.receiver.push({
      $: {
        'android:name': '.AzanReceiver',
        'android:exported': 'false',
      },
      'intent-filter': [
        {
          action: [
            { $: { 'android:name': 'com.salahfirst.app.STOP_AZAN' } },
            { $: { 'android:name': 'com.salahfirst.app.MARK_PRAYED' } },
          ],
        },
      ],
    });

    mainApp.receiver.push({
      $: {
        'android:name': '.AzanBootReceiver',
        'android:enabled': 'true',
        'android:exported': 'true',
      },
      'intent-filter': [
        {
          action: [
            { $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } },
            { $: { 'android:name': 'android.intent.action.LOCKED_BOOT_COMPLETED' } },
            { $: { 'android:name': 'android.intent.action.MY_PACKAGE_REPLACED' } },
            { $: { 'android:name': 'android.intent.action.TIME_SET' } },
            { $: { 'android:name': 'android.intent.action.TIMEZONE_CHANGED' } },
          ],
          category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        },
      ],
    });

    return mod;
  });
}

function withSalahFirstMainApplication(config) {
  return withMainApplication(config, (mod) => {
    let contents = mod.modResults.contents;

    const registrations = [
      'add(AzanPackage())',
      'add(SystemNavPackage())',
      'add(FocusSilencerPackage())',
    ];

    if (!contents.includes('AzanPackage()')) {
      const targetPattern = /PackageList\(this\)\.packages\.apply\s*\{/;
      if (targetPattern.test(contents)) {
        contents = contents.replace(
          targetPattern,
          (match) => `${match}\n          ${registrations.join('\n          ')}`
        );
      }
    }

    mod.modResults.contents = contents;
    return mod;
  });
}

function withSalahFirstNativeFiles(config) {
  return withDangerousMod(config, [
    'android',
    async (mod) => {
      const projectRoot = mod.modRequest.projectRoot;
      const srcDir = path.join(projectRoot, 'plugins', 'android-src');
      const destPkgDir = path.join(
        mod.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'java',
        'com',
        'salahfirst',
        'app'
      );

      fs.mkdirSync(destPkgDir, { recursive: true });

      // Remove legacy AzanService.kt if present locally
      const legacyService = path.join(destPkgDir, 'AzanService.kt');
      if (fs.existsSync(legacyService)) {
        fs.unlinkSync(legacyService);
      }

      for (const file of KOTLIN_FILES) {
        const from = path.join(srcDir, file);
        const to = path.join(destPkgDir, file);
        if (fs.existsSync(from)) {
          fs.copyFileSync(from, to);
        }
      }

      const rawDir = path.join(
        mod.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'raw'
      );
      fs.mkdirSync(rawDir, { recursive: true });

      for (const audio of AUDIO_FILES) {
        const audioSrc = path.join(projectRoot, 'assets', 'audio', audio);
        const audioDest = path.join(rawDir, audio);
        if (fs.existsSync(audioSrc)) {
          fs.copyFileSync(audioSrc, audioDest);
        }
      }

      const keepXmlPath = path.join(rawDir, 'keep.xml');
      const keepXmlContent =
        '<resources xmlns:tools="http://schemas.android.com/tools" tools:keep="@raw/azan_makkah,@raw/azan_madinah,@raw/azan_alaqsa,@raw/azan_alafasy,@raw/azan_fajr,@raw/azan_qatami,@raw/prayer_tone,@raw/assets_audio_azan_makkah,@raw/assets_audio_azan_madinah,@raw/assets_audio_azan_alaqsa,@raw/assets_audio_azan_alafasy,@raw/assets_audio_azan_fajr,@raw/assets_audio_azan_qatami,@raw/assets_audio_prayer_tone" />\n';
      fs.writeFileSync(keepXmlPath, keepXmlContent, 'utf8');

      const proguardPath = path.join(
        mod.modRequest.platformProjectRoot,
        'app',
        'proguard-rules.pro'
      );
      if (fs.existsSync(proguardPath)) {
        let proguardContent = fs.readFileSync(proguardPath, 'utf8');
        const keepRule = '-keep class com.salahfirst.app.** { *; }';
        if (!proguardContent.includes(keepRule)) {
          proguardContent += '\n# Preserve all SalahFirst native Android engine classes for release AAB/APK\n-keep class com.salahfirst.app.** { *; }\n-keepclassmembers class com.salahfirst.app.** { *; }\n';
          fs.writeFileSync(proguardPath, proguardContent, 'utf8');
        }
      }

      // Ensure local.properties exists on Windows when ANDROID_HOME is not set globally
      const localPropsPath = path.join(mod.modRequest.platformProjectRoot, 'local.properties');
      if (!fs.existsSync(localPropsPath) && process.env.LOCALAPPDATA) {
        const defaultWinSdk = path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk');
        if (fs.existsSync(defaultWinSdk)) {
          const escapedSdk = defaultWinSdk.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
          fs.writeFileSync(localPropsPath, `sdk.dir=${escapedSdk}\n`, 'utf8');
        }
      }

      // Sanitize rootProject.name in settings.gradle so apostrophes in "As'Salah" don't break Gradle
      const settingsGradlePath = path.join(mod.modRequest.platformProjectRoot, 'settings.gradle');
      if (fs.existsSync(settingsGradlePath)) {
        let settingsGradle = fs.readFileSync(settingsGradlePath, 'utf8');
        settingsGradle = settingsGradle.replace(/rootProject\.name\s*=\s*.*/g, "rootProject.name = 'AsSalah'");
        fs.writeFileSync(settingsGradlePath, settingsGradle, 'utf8');
      }

      // Configure CMAKE_OBJECT_PATH_MAX=220 on Windows to enable CMake object path hashing and avoid 260-char MAX_PATH ninja mkdir errors
      const appBuildGradlePath = path.join(mod.modRequest.platformProjectRoot, 'app', 'build.gradle');
      if (fs.existsSync(appBuildGradlePath)) {
        let appBuildGradle = fs.readFileSync(appBuildGradlePath, 'utf8');
        if (!appBuildGradle.includes('CMAKE_OBJECT_PATH_MAX=220')) {
          appBuildGradle = appBuildGradle.replace(
            /defaultConfig\s*\{/,
            'defaultConfig {\n        externalNativeBuild {\n            cmake {\n                arguments "-DCMAKE_OBJECT_PATH_MAX=220"\n            }\n        }'
          );
          fs.writeFileSync(appBuildGradlePath, appBuildGradle, 'utf8');
        }
      }

      return mod;
    },
  ]);
}

module.exports = function withSalahFirstNative(config) {
  config = withSalahFirstManifest(config);
  config = withSalahFirstMainApplication(config);
  config = withSalahFirstNativeFiles(config);
  return config;
};
