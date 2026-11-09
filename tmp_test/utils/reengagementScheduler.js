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
exports.updatePendingReengagementLanguage = exports.scheduleStandbyReengagement = exports.calculateReengagementTargetTime = exports.cancelPendingReengagement = exports.saveReengagementConfig = exports.getReengagementConfig = exports.DEFAULT_REENGAGEMENT_CONFIG = void 0;
const Notifications = __importStar(require("expo-notifications"));
const storage_1 = require("./storage");
const timezone_1 = require("./timezone");
const notificationChannels_1 = require("./notificationChannels");
const reengagementManager_1 = require("./reengagementManager");
const reengagement_1 = require("@/data/reengagement");
exports.DEFAULT_REENGAGEMENT_CONFIG = {
    enabled: true,
};
const getReengagementConfig = async () => {
    return await storage_1.storage.get(reengagementManager_1.REENGAGEMENT_CONFIG_KEY, exports.DEFAULT_REENGAGEMENT_CONFIG);
};
exports.getReengagementConfig = getReengagementConfig;
const saveReengagementConfig = async (config) => {
    await storage_1.storage.set(reengagementManager_1.REENGAGEMENT_CONFIG_KEY, config);
    if (!config.enabled) {
        await (0, exports.cancelPendingReengagement)();
    }
};
exports.saveReengagementConfig = saveReengagementConfig;
const cancelPendingReengagement = async () => {
    try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        for (const notif of scheduled) {
            if (notif.identifier.startsWith('salahfirst-reengagement-')) {
                await Notifications.cancelScheduledNotificationAsync(notif.identifier);
            }
        }
    }
    catch { }
};
exports.cancelPendingReengagement = cancelPendingReengagement;
/**
 * Calculates a respectful daytime delivery timestamp (10:00 AM - 8:00 PM local)
 * at least 24 hours after the user's last session.
 */
const calculateReengagementTargetTime = (minEligibleDate, timezone) => {
    const local = (0, timezone_1.getLocalDateComponents)(minEligibleDate, timezone);
    const targetDate = new Date(minEligibleDate);
    let startTotalMins = 10 * 60; // 10:00 AM = 600 mins
    const endTotalMins = 20 * 60; // 08:00 PM = 1200 mins
    if (local.hour >= 20) {
        // Past 8:00 PM in local time, advance to next calendar day
        targetDate.setDate(targetDate.getDate() + 1);
    }
    else if (local.hour >= 10) {
        // Within 10:00 AM - 8:00 PM, target between now+15m and 8:00 PM
        const currentMins = local.hour * 60 + local.minute;
        startTotalMins = Math.min(endTotalMins - 15, currentMins + 15);
    }
    const range = Math.max(1, endTotalMins - startTotalMins);
    const randomMins = Math.floor(Math.random() * range);
    const chosenTotalMins = startTotalMins + randomMins;
    targetDate.setHours(Math.floor(chosenTotalMins / 60), chosenTotalMins % 60, 0, 0);
    return targetDate;
};
exports.calculateReengagementTargetTime = calculateReengagementTargetTime;
const scheduleStandbyReengagement = async (params) => {
    try {
        const config = await (0, exports.getReengagementConfig)();
        if (!config.enabled)
            return false;
        const { granted } = await (0, notificationChannels_1.checkNotificationPermissions)();
        if (!granted)
            return false;
        // Remove any previously scheduled standby reengagement before queueing fresh one
        await (0, exports.cancelPendingReengagement)();
        const lang = params.language === 'ur' || params.language === 'ar' ? params.language : 'en';
        // 24 hours inactivity baseline
        const now = new Date();
        const minEligible = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const targetDate = (0, exports.calculateReengagementTargetTime)(minEligible, params.timezone);
        const targetLocal = (0, timezone_1.getLocalDateComponents)(targetDate, params.timezone);
        const targetDateKey = targetLocal.dateKey;
        // Check if already delivered on target date
        const alreadyDelivered = await (0, reengagementManager_1.hasDeliveredReengagementOnDate)(targetDateKey);
        if (alreadyDelivered)
            return false;
        const item = await (0, reengagementManager_1.selectNextReengagement)(targetDateKey);
        if (!item)
            return false;
        await Notifications.scheduleNotificationAsync({
            identifier: `salahfirst-reengagement-${targetDateKey}`,
            content: {
                title: item.title[lang] || item.title.en,
                body: item.body[lang] || item.body.en,
                sound: 'default',
                data: {
                    type: 'reengagement',
                    contentId: item.id,
                    dateKey: targetDateKey,
                    category: item.category,
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: targetDate,
                channelId: notificationChannels_1.REENGAGEMENT_CHANNEL_ID,
            },
        });
        return true;
    }
    catch {
        return false;
    }
};
exports.scheduleStandbyReengagement = scheduleStandbyReengagement;
const updatePendingReengagementLanguage = async (newLanguage) => {
    try {
        const lang = newLanguage === 'ur' || newLanguage === 'ar' ? newLanguage : 'en';
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        for (const notif of scheduled) {
            if (notif.identifier.startsWith('salahfirst-reengagement-')) {
                const data = notif.content.data;
                if (data?.contentId) {
                    const item = (0, reengagement_1.getReengagementById)(data.contentId);
                    if (item && notif.trigger && 'date' in notif.trigger) {
                        await Notifications.scheduleNotificationAsync({
                            identifier: notif.identifier,
                            content: {
                                title: item.title[lang] || item.title.en,
                                body: item.body[lang] || item.body.en,
                                sound: notif.content.sound || 'default',
                                data: notif.content.data,
                            },
                            trigger: notif.trigger,
                        });
                    }
                }
            }
        }
    }
    catch { }
};
exports.updatePendingReengagementLanguage = updatePendingReengagementLanguage;
