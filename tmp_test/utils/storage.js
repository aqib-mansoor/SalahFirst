"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
/**
 * Offline-First Local Storage Wrapper
 * Safe JSON serialize/deserialize with error handling.
 */
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
exports.storage = {
    async get(key, fallback) {
        try {
            const item = await async_storage_1.default.getItem(key);
            return item ? JSON.parse(item) : fallback;
        }
        catch {
            return fallback;
        }
    },
    async set(key, value) {
        try {
            await async_storage_1.default.setItem(key, JSON.stringify(value));
            return true;
        }
        catch {
            return false;
        }
    },
    async remove(key) {
        try {
            await async_storage_1.default.removeItem(key);
            return true;
        }
        catch {
            return false;
        }
    },
    async clear() {
        try {
            await async_storage_1.default.clear();
            return true;
        }
        catch {
            return false;
        }
    },
};
