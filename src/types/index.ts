// 夢のタグ種類
export type DreamTag =
  | '楽しい'
  | '怖い'
  | '不思議'
  | '懐かしい'
  | '予知夢'
  | '悪夢'
  | '明晰夢'
  | 'その他';

// 夢日記データ
export interface Dream {
  id: string;
  date: string; // YYYY-MM-DD
  content: string; // 夢の内容
  interpretation: string; // AI解釈
  imageUrl: string; // Base64画像 or URL
  imagePrompt: string; // 画像生成プロンプト
  tags: DreamTag[]; // タグ
  keywords: string[]; // 抽出キーワード
  createdAt: number;
  updatedAt: number;
}

// テキストAIプロバイダー
export type TextApiProvider = 'openai' | 'anthropic' | 'gemini';

// 画像生成プロバイダー
export type ImageApiProvider = 'openai' | 'stability' | 'gemini';

// Gemini画像モデル
export type GeminiImageModel = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';

// テーマ設定
export type ThemeMode = 'light' | 'dark' | 'system';

// 設定
export interface Settings {
  textApiProvider: TextApiProvider;
  textApiKey: string;
  textModel: string;
  imageApiProvider: ImageApiProvider;
  imageApiKey: string;
  geminiImageModel: GeminiImageModel;
  theme: ThemeMode;
}

// AI解釈レスポンス
export interface InterpretationResult {
  interpretation: string;
  keywords: string[];
  imagePrompt: string;
}

// 画像生成レスポンス
export interface ImageGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
}

// 画面タブ
export type TabType = 'home' | 'list' | 'stats' | 'settings';

// 統計データ
export interface DreamStats {
  totalDreams: number;
  dreamsByMonth: { month: string; count: number }[];
  tagDistribution: { tag: DreamTag; count: number }[];
  topKeywords: { keyword: string; count: number }[];
}
