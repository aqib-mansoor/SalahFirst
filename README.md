# SalahFirst

A lightweight, distraction-free Islamic companion app built with React Native and Expo. Designed to provide accurate prayer schedules, reliable Qibla orientation, and daily Islamic utilities with a focus on speed, offline reliability, and privacy.

---

## Overview

Many prayer apps today suffer from intrusive ads, heavy analytics trackers, and cluttered interfaces. **SalahFirst** is built around a simpler premise: provide Muslims with fast, reliable, and privacy-respecting prayer utilities without unnecessary bloat.

### Core Objectives

- **Offline-First Calculation:** Astronomical prayer calculations compute locally on-device. An internet connection is only needed if you choose to resolve location names via geocoding.
- **Calculation Standards:** Configurable methods to accommodate major conventions:
  - University of Islamic Sciences, Karachi
  - Muslim World League (MWL)
  - Islamic Society of North America (ISNA)
  - Umm al-Qura University, Makkah
  - Egyptian General Authority of Survey
  - Juristic options for Asr (Standard / Shafi'i vs. Hanafi)
- **Privacy & Respect:** Zero third-party ad networks, no persistent background tracking, and no unnecessary device permissions.
- **Low Resource Usage:** Lightweight footprint with battery-conscious background scheduling for prayer alerts.

---

## Features (Roadmap & Status)

- [ ] **Prayer Timings:** Accurate day schedules with a clean countdown to the next prayer.
- [ ] **Qibla Compass:** Device sensor integration with true north and magnetic declination handling.
- [ ] **Azan & Reminders:** Local notifications for prayer times and custom pre-prayer reminders.
- [ ] **Hijri Date Support:** Accurate Islamic calendar synchronization with manual correction offsets.
- [ ] **Tasbeeh Counter:** Minimalist digital counter with haptic feedback.

---

## Tech Stack

- **Framework:** React Native (Expo SDK 52+)
- **Language:** TypeScript
- **State & Storage:** React Hooks / AsyncStorage
- **Target Platforms:** Android & iOS

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (LTS recommended)
- A package manager (`npm`, `yarn`, or `pnpm`)
- Mobile testing environment:
  - [Expo Go](https://expo.dev/go) on your physical Android/iOS device, or
  - Android Studio emulator / Xcode simulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aqib-mansoor/SalahFirst.git
   cd SalahFirst
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code in the terminal using the Expo Go app (Android) or the default Camera app (iOS).

---

## Project Structure

```text
SalahFirst/
├── assets/          # Static media, icons, and splash screens
├── App.tsx          # Application entry point
├── app.json         # Expo app manifest and configuration
├── index.ts         # Runtime registration
├── package.json     # Project dependencies and scripts
└── tsconfig.json    # TypeScript compiler configuration
```

---

## License

This project is licensed under the [MIT License](LICENSE).
