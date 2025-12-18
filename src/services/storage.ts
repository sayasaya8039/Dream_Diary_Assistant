import type { Dream, Settings } from '@/types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/utils/constants';

// Chrome Storage API ラッパー

/**
 * 夢日記一覧を取得
 */
export const getDreams = async (): Promise<Dream[]> => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.DREAMS);
  return result[STORAGE_KEYS.DREAMS] || [];
};

/**
 * 夢日記を保存
 */
export const saveDream = async (dream: Dream): Promise<void> => {
  const dreams = await getDreams();
  const existingIndex = dreams.findIndex((d) => d.id === dream.id);

  if (existingIndex >= 0) {
    dreams[existingIndex] = { ...dream, updatedAt: Date.now() };
  } else {
    dreams.unshift(dream);
  }

  await chrome.storage.local.set({ [STORAGE_KEYS.DREAMS]: dreams });
};

/**
 * 夢日記を削除
 */
export const deleteDream = async (dreamId: string): Promise<void> => {
  const dreams = await getDreams();
  const filtered = dreams.filter((d) => d.id !== dreamId);
  await chrome.storage.local.set({ [STORAGE_KEYS.DREAMS]: filtered });
};

/**
 * 設定を取得
 */
export const getSettings = async (): Promise<Settings> => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return { ...DEFAULT_SETTINGS, ...result[STORAGE_KEYS.SETTINGS] };
};

/**
 * 設定を保存
 */
export const saveSettings = async (settings: Partial<Settings>): Promise<void> => {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: updated });
};

/**
 * 全データをエクスポート
 */
export const exportData = async (): Promise<string> => {
  const dreams = await getDreams();
  const settings = await getSettings();
  return JSON.stringify({ dreams, settings, exportedAt: new Date().toISOString() }, null, 2);
};

/**
 * データをインポート
 */
export const importData = async (jsonString: string): Promise<void> => {
  const data = JSON.parse(jsonString);
  if (data.dreams) {
    await chrome.storage.local.set({ [STORAGE_KEYS.DREAMS]: data.dreams });
  }
  if (data.settings) {
    await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: data.settings });
  }
};

/**
 * 全データをクリア
 */
export const clearAllData = async (): Promise<void> => {
  await chrome.storage.local.clear();
};
