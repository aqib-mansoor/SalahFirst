"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectNextReengagement = exports.recordReengagementDelivery = exports.hasDeliveredReengagementOnDate = exports.getReengagementHistory = exports.isUserInactive = exports.getLastActiveTime = exports.recordAppActive = exports.INACTIVITY_THRESHOLD_MS = exports.REENGAGEMENT_CONFIG_KEY = exports.LAST_ACTIVE_TIME_KEY = exports.REENGAGEMENT_HISTORY_KEY = void 0;
const storage_1 = require("./storage");
const reengagement_1 = require("@/data/reengagement");
exports.REENGAGEMENT_HISTORY_KEY = '@salahfirst_reengagement_history';
exports.LAST_ACTIVE_TIME_KEY = '@salahfirst_last_active_time';
exports.REENGAGEMENT_CONFIG_KEY = '@salahfirst_reengagement_config';
exports.INACTIVITY_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;
const recordAppActive = async (timestamp) => {
    const time = timestamp ?? Date.now();
    await storage_1.storage.set(exports.LAST_ACTIVE_TIME_KEY, time);
};
exports.recordAppActive = recordAppActive;
const getLastActiveTime = async () => {
    return await storage_1.storage.get(exports.LAST_ACTIVE_TIME_KEY, null);
};
exports.getLastActiveTime = getLastActiveTime;
const isUserInactive = async (nowMs) => {
    const lastActive = await (0, exports.getLastActiveTime)();
    if (!lastActive)
        return false; // First launch or no prior session
    const current = nowMs ?? Date.now();
    return current - lastActive >= exports.INACTIVITY_THRESHOLD_MS;
};
exports.isUserInactive = isUserInactive;
const getReengagementHistory = async () => {
    return await storage_1.storage.get(exports.REENGAGEMENT_HISTORY_KEY, []);
};
exports.getReengagementHistory = getReengagementHistory;
const hasDeliveredReengagementOnDate = async (dateKey) => {
    const history = await (0, exports.getReengagementHistory)();
    return history.some((h) => h.deliveredDate === dateKey);
};
exports.hasDeliveredReengagementOnDate = hasDeliveredReengagementOnDate;
const recordReengagementDelivery = async (contentId, dateKey, category) => {
    const history = await (0, exports.getReengagementHistory)();
    const filtered = history.filter((h) => h.deliveredDate !== dateKey);
    const updated = [
        { contentId, deliveredDate: dateKey, category },
        ...filtered,
    ].slice(0, 180);
    await storage_1.storage.set(exports.REENGAGEMENT_HISTORY_KEY, updated);
};
exports.recordReengagementDelivery = recordReengagementDelivery;
const selectNextReengagement = async (targetDateKey) => {
    if (reengagement_1.ALL_REENGAGEMENT_ITEMS.length === 0)
        return null;
    const history = await (0, exports.getReengagementHistory)();
    const targetDate = new Date(targetDateKey);
    const targetMs = targetDate.getTime();
    const lastDeliveredMap = new Map();
    history.forEach((h) => {
        const entryMs = new Date(h.deliveredDate).getTime();
        const existing = lastDeliveredMap.get(h.contentId);
        if (!existing || entryMs > existing) {
            lastDeliveredMap.set(h.contentId, entryMs);
        }
    });
    // 1. Filter out items delivered within last 60 days
    const eligible60Days = reengagement_1.ALL_REENGAGEMENT_ITEMS.filter((item) => {
        const lastMs = lastDeliveredMap.get(item.id);
        if (!lastMs)
            return true;
        return targetMs - lastMs >= SIXTY_DAYS_MS;
    });
    const pool = eligible60Days.length > 0 ? eligible60Days : reengagement_1.ALL_REENGAGEMENT_ITEMS;
    // 2. Prevent consecutive category repetition
    const lastDeliveredCategory = history.length > 0 ? history[0].category : null;
    const differentCategoryPool = pool.filter((item) => item.category !== lastDeliveredCategory);
    const categoryFilteredPool = differentCategoryPool.length > 0 ? differentCategoryPool : pool;
    // 3. Prefer unused items
    const unreadItems = categoryFilteredPool.filter((item) => !lastDeliveredMap.has(item.id));
    if (unreadItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * unreadItems.length);
        return unreadItems[randomIndex];
    }
    // 4. Oldest delivered fallback
    const sortedByOldest = [...categoryFilteredPool].sort((a, b) => {
        const timeA = lastDeliveredMap.get(a.id) || 0;
        const timeB = lastDeliveredMap.get(b.id) || 0;
        return timeA - timeB;
    });
    return sortedByOldest[0] || reengagement_1.ALL_REENGAGEMENT_ITEMS[0];
};
exports.selectNextReengagement = selectNextReengagement;
