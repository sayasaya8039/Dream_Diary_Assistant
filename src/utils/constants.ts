import type { DreamTag, Settings } from '@/types';

// 利用可能なタグ一覧
export const DREAM_TAGS: DreamTag[] = [
  '楽しい',
  '怖い',
  '不思議',
  '懐かしい',
  '予知夢',
  '悪夢',
  '明晰夢',
  'その他',
];

// タグの色定義
export const TAG_COLORS: Record<DreamTag, { light: string; dark: string }> = {
  '楽しい': { light: 'bg-green-100 text-green-700', dark: 'bg-green-900 text-green-200' },
  '怖い': { light: 'bg-red-100 text-red-700', dark: 'bg-red-900 text-red-200' },
  '不思議': { light: 'bg-purple-100 text-purple-700', dark: 'bg-purple-900 text-purple-200' },
  '懐かしい': { light: 'bg-amber-100 text-amber-700', dark: 'bg-amber-900 text-amber-200' },
  '予知夢': { light: 'bg-blue-100 text-blue-700', dark: 'bg-blue-900 text-blue-200' },
  '悪夢': { light: 'bg-gray-100 text-gray-700', dark: 'bg-gray-800 text-gray-200' },
  '明晰夢': { light: 'bg-cyan-100 text-cyan-700', dark: 'bg-cyan-900 text-cyan-200' },
  'その他': { light: 'bg-slate-100 text-slate-700', dark: 'bg-slate-800 text-slate-200' },
};

// デフォルト設定
export const DEFAULT_SETTINGS: Settings = {
  textApiProvider: 'openai',
  textApiKey: '',
  textModel: 'gpt-4o-mini',
  imageApiProvider: 'openai',
  imageApiKey: '',
  theme: 'system',
};

// OpenAIモデル一覧
export const OPENAI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
];

// Claudeモデル一覧
export const CLAUDE_MODELS = [
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
];

// Storage keys
export const STORAGE_KEYS = {
  DREAMS: 'dreams',
  SETTINGS: 'settings',
} as const;

// アプリ情報
export const APP_INFO = {
  name: 'Dream Diary Assistant',
  version: '1.0.0',
} as const;
