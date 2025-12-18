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
  textModel: 'gpt-4.1-mini',
  imageApiProvider: 'openai',
  imageApiKey: '',
  theme: 'system',
};

// OpenAIモデル一覧
export const OPENAI_MODELS = [
  { id: 'gpt-5.2', name: 'GPT-5.2' },
  { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro' },
  { id: 'gpt-4.1', name: 'GPT-4.1' },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  { id: 'o4-mini', name: 'o4-mini (推論)' },
];

// Claudeモデル一覧
export const CLAUDE_MODELS = [
  { id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5' },
  { id: 'claude-sonnet-4-5-20250514', name: 'Claude Sonnet 4.5' },
  { id: 'claude-haiku-4-5-20251015', name: 'Claude Haiku 4.5' },
];

// Geminiモデル一覧
export const GEMINI_MODELS = [
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
];

// Storage keys
export const STORAGE_KEYS = {
  DREAMS: 'dreams',
  SETTINGS: 'settings',
} as const;

// アプリ情報
export const APP_INFO = {
  name: 'Dream Diary Assistant',
  version: '1.2.0',
} as const;
