import { create } from 'zustand';
import type { Dream, Settings, TabType } from '@/types';
import * as storage from '@/services/storage';
import { DEFAULT_SETTINGS } from '@/utils/constants';
import { getSystemTheme } from '@/utils/helpers';

interface DreamState {
  // データ
  dreams: Dream[];
  settings: Settings;
  currentTab: TabType;
  isLoading: boolean;
  error: string | null;

  // テーマ
  effectiveTheme: 'light' | 'dark';

  // アクション
  initialize: () => Promise<void>;
  addDream: (dream: Dream) => Promise<void>;
  updateDream: (dream: Dream) => Promise<void>;
  deleteDream: (dreamId: string) => Promise<void>;
  setCurrentTab: (tab: TabType) => void;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useDreamStore = create<DreamState>((set, get) => ({
  dreams: [],
  settings: DEFAULT_SETTINGS,
  currentTab: 'home',
  isLoading: true,
  error: null,
  effectiveTheme: 'light',

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const [dreams, settings] = await Promise.all([
        storage.getDreams(),
        storage.getSettings(),
      ]);

      const effectiveTheme =
        settings.theme === 'system' ? getSystemTheme() : settings.theme;

      set({ dreams, settings, effectiveTheme, isLoading: false });

      // システムテーマの変更を監視
      if (typeof window !== 'undefined' && window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const { settings } = get();
          if (settings.theme === 'system') {
            set({ effectiveTheme: e.matches ? 'dark' : 'light' });
          }
        });
      }
    } catch (error) {
      set({ error: 'データの読み込みに失敗しました', isLoading: false });
    }
  },

  addDream: async (dream) => {
    try {
      await storage.saveDream(dream);
      set((state) => ({ dreams: [dream, ...state.dreams] }));
    } catch (error) {
      set({ error: '夢の保存に失敗しました' });
    }
  },

  updateDream: async (dream) => {
    try {
      await storage.saveDream(dream);
      set((state) => ({
        dreams: state.dreams.map((d) => (d.id === dream.id ? dream : d)),
      }));
    } catch (error) {
      set({ error: '夢の更新に失敗しました' });
    }
  },

  deleteDream: async (dreamId) => {
    try {
      await storage.deleteDream(dreamId);
      set((state) => ({
        dreams: state.dreams.filter((d) => d.id !== dreamId),
      }));
    } catch (error) {
      set({ error: '夢の削除に失敗しました' });
    }
  },

  setCurrentTab: (tab) => set({ currentTab: tab }),

  updateSettings: async (newSettings) => {
    try {
      const updated = { ...get().settings, ...newSettings };
      await storage.saveSettings(updated);

      const effectiveTheme =
        updated.theme === 'system' ? getSystemTheme() : updated.theme;

      set({ settings: updated, effectiveTheme });
    } catch (error) {
      set({ error: '設定の保存に失敗しました' });
    }
  },

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));
