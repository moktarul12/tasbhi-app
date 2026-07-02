import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ZIKRS: '@tashbi/zikrs',
  SETTINGS: '@tashbi/settings',
  DAILY_LOGS: '@tashbi/daily_logs',
  REMINDERS: '@tashbi/reminders',
  CATEGORIES: '@tashbi/categories',
  LAST_ZIKR_ID: '@tashbi/last_zikr_id',
  LOCATION: '@tashbi/location',
};

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // no-op, storage failures are non-fatal for this app
  }
}

export { KEYS };
