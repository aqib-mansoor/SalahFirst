import { PermissionKey } from '@/native/FocusBlockerBridge';

export interface PermissionStepGuide {
  key: PermissionKey;
  title: string;
  badge: string;
  tagline: string;
  whyNeeded: string;
  steps: string[];
  ctaLabel: string;
}

export const PERMISSION_GUIDES: Record<PermissionKey, PermissionStepGuide> = {
  accessibility: {
    key: 'accessibility',
    title: 'App Blocker Access',
    badge: 'Salah Shield',
    tagline: 'Intercept distracting apps during prayer',
    whyNeeded:
      'Required by Android to detect when social media or video apps are opened during your focus countdown and bring you straight back.',
    steps: [
      'Find "SalahFirst" under Installed Services',
      'Toggle the switch to "On" / "Allow"',
      'Tap Allow to confirm',
    ],
    ctaLabel: 'Open Accessibility Settings',
  },
  exactAlarm: {
    key: 'exactAlarm',
    title: 'Exact Alarms & Reminders',
    badge: 'On-Time Call',
    tagline: 'Guarantees Azan plays at the exact second',
    whyNeeded:
      'Android battery saver delays generic notifications. Enabling exact alarms ensures your Azan recites right on time.',
    steps: [
      'Locate "Allow setting alarms and reminders"',
      'Turn the toggle "On"',
      'Return to SalahFirst',
    ],
    ctaLabel: 'Open Alarm Settings',
  },
  batteryOptimization: {
    key: 'batteryOptimization',
    title: 'Background Protection',
    badge: 'Never Truncated',
    tagline: 'Prevent device from killing Azan when phone is locked',
    whyNeeded:
      'Aggressive phone battery cleaners terminate background audio. Exempting SalahFirst allows the full 4-minute Azan to complete in your pocket.',
    steps: [
      'Select "All apps" in the top dropdown',
      'Find "SalahFirst"',
      'Choose "Don\'t optimize" or "Unrestricted"',
    ],
    ctaLabel: 'Exempt From Battery Saver',
  },
  overlay: {
    key: 'overlay',
    title: 'Floating Focus Pill',
    badge: 'Visual Banner',
    tagline: 'Show a subtle tap-to-return pill over other apps',
    whyNeeded:
      'Permits SalahFirst to show a floating reminder button so you can easily return with a single tap if you step away.',
    steps: [
      'Find "SalahFirst" in the list',
      'Enable "Allow display over other apps"',
    ],
    ctaLabel: 'Open Overlay Settings',
  },
  notifications: {
    key: 'notifications',
    title: 'Notification & Audio Sounds',
    badge: 'Essential',
    tagline: 'Allow Azan notifications and prayer alerts',
    whyNeeded:
      'Allows scheduled prayer alerts and silent-mode overrides for Azan recitation to appear on your lock screen.',
    steps: [
      'Toggle "All SalahFirst notifications" to On',
      'Make sure "Sound and vibration" is permitted',
    ],
    ctaLabel: 'Open Notification Settings',
  },
};
