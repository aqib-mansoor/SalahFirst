"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestNotificationPermission = exports.checkNotificationPermissions = exports.setupNotificationChannels = exports.FOCUS_CHANNEL_ID = exports.REENGAGEMENT_CHANNEL_ID = exports.INSPIRATION_CHANNEL_ID = exports.REFLECTION_CHANNEL_ID = exports.MISSED_CHANNEL_ID = exports.REMINDER_CHANNEL_ID = exports.PRAYER_CHANNEL_ID = void 0;
const Notifications = __importStar(require("expo-notifications"));
const react_native_1 = require("react-native");
exports.PRAYER_CHANNEL_ID = 'salahfirst-prayer-alerts';
exports.REMINDER_CHANNEL_ID = 'salahfirst-pre-reminders';
exports.MISSED_CHANNEL_ID = 'salahfirst-missed-reminders';
exports.REFLECTION_CHANNEL_ID = 'salahfirst-reflection';
exports.INSPIRATION_CHANNEL_ID = 'salahfirst-daily-inspiration';
exports.REENGAGEMENT_CHANNEL_ID = 'salahfirst-reengagement';
exports.FOCUS_CHANNEL_ID = 'salahfirst-focus-mode';
const setupNotificationChannels = async () => {
    if (react_native_1.Platform.OS !== 'android')
        return;
    await Notifications.setNotificationChannelAsync(exports.PRAYER_CHANNEL_ID, {
        name: 'Prayer Time & Azan Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 300, 200, 300],
        lightColor: '#114B36',
        enableLights: true,
        enableVibrate: true,
        sound: 'default',
    });
    await Notifications.setNotificationChannelAsync(exports.REMINDER_CHANNEL_ID, {
        name: 'Pre-Prayer Gentle Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: '#CCA15F',
        enableLights: true,
        enableVibrate: true,
        sound: 'default',
    });
    await Notifications.setNotificationChannelAsync(exports.MISSED_CHANNEL_ID, {
        name: 'Missed Prayer Follow-ups',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 150, 100, 150],
        lightColor: '#CCA15F',
        enableLights: true,
        enableVibrate: true,
        sound: 'default',
    });
    await Notifications.setNotificationChannelAsync(exports.REFLECTION_CHANNEL_ID, {
        name: 'Daily Reflection & Streaks',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 100, 100, 100],
        lightColor: '#114B36',
        enableLights: true,
        enableVibrate: true,
        sound: 'default',
    });
    await Notifications.setNotificationChannelAsync(exports.INSPIRATION_CHANNEL_ID, {
        name: 'Daily Islamic Inspiration',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 150, 100, 150],
        lightColor: '#CCA15F',
        enableLights: true,
        enableVibrate: true,
        sound: 'default',
    });
    await Notifications.setNotificationChannelAsync(exports.REENGAGEMENT_CHANNEL_ID, {
        name: 'Gentle Islamic Reconnection',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 150, 100, 150],
        lightColor: '#114B36',
        enableLights: true,
        enableVibrate: true,
        sound: 'default',
    });
    await Notifications.setNotificationChannelAsync(exports.FOCUS_CHANNEL_ID, {
        name: 'Prayer Focus Mode & Shield',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: '#114B36',
        enableLights: true,
        enableVibrate: false,
        sound: 'default',
    });
};
exports.setupNotificationChannels = setupNotificationChannels;
const checkNotificationPermissions = async () => {
    try {
        const { status, canAskAgain } = await Notifications.getPermissionsAsync();
        return {
            granted: status === 'granted',
            canAskAgain,
        };
    }
    catch {
        return { granted: false, canAskAgain: true };
    }
};
exports.checkNotificationPermissions = checkNotificationPermissions;
const requestNotificationPermission = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus === 'granted') {
            await (0, exports.setupNotificationChannels)();
            return true;
        }
        return false;
    }
    catch {
        return false;
    }
};
exports.requestNotificationPermission = requestNotificationPermission;
