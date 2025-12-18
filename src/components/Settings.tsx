import { useState } from 'react';
import { Eye, EyeOff, Download, Upload, Trash2, ExternalLink } from 'lucide-react';
import { useDreamStore } from '@/stores/dreamStore';
import { OPENAI_MODELS, CLAUDE_MODELS, GEMINI_MODELS, APP_INFO } from '@/utils/constants';
import * as storage from '@/services/storage';
import type { TextApiProvider, ImageApiProvider, ThemeMode } from '@/types';

export const Settings = () => {
  const { settings, updateSettings } = useDreamStore();
  const [showTextApiKey, setShowTextApiKey] = useState(false);
  const [showImageApiKey, setShowImageApiKey] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const models = settings.textApiProvider === 'openai'
    ? OPENAI_MODELS
    : settings.textApiProvider === 'anthropic'
      ? CLAUDE_MODELS
      : GEMINI_MODELS;

  const handleExport = async () => {
    try {
      const data = await storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dream-diary-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await storage.importData(text);
      window.location.reload();
    } catch (error) {
      setImportError('インポートに失敗しました。ファイル形式を確認してください。');
    }
  };

  const handleClearData = async () => {
    await storage.clearAllData();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <div className="p-4 space-y-6 animate-fadeIn">
      <h2 className="text-lg font-bold text-light-text dark:text-dark-text">
        設定
      </h2>

      {/* テキストAI設定 */}
      <section className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4 space-y-4">
        <h3 className="font-medium text-light-text dark:text-dark-text">
          テキストAI (夢の解釈)
        </h3>

        {/* プロバイダー選択 */}
        <div>
          <label className="block text-sm text-light-text-sub dark:text-dark-text-sub mb-1">
            プロバイダー
          </label>
          <select
            value={settings.textApiProvider}
            onChange={(e) => {
              const provider = e.target.value as TextApiProvider;
              const defaultModel = provider === 'openai'
                ? 'gpt-4o-mini'
                : provider === 'anthropic'
                  ? 'claude-3-5-sonnet-20241022'
                  : 'gemini-2.0-flash-exp';
              updateSettings({
                textApiProvider: provider,
                textModel: defaultModel,
              });
            }}
            className="w-full px-3 py-2 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
          >
            <option value="openai">OpenAI (GPT-4)</option>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="gemini">Google (Gemini)</option>
          </select>
        </div>

        {/* モデル選択 */}
        <div>
          <label className="block text-sm text-light-text-sub dark:text-dark-text-sub mb-1">
            モデル
          </label>
          <select
            value={settings.textModel}
            onChange={(e) => updateSettings({ textModel: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* APIキー */}
        <div>
          <label className="block text-sm text-light-text-sub dark:text-dark-text-sub mb-1">
            APIキー
          </label>
          <div className="relative">
            <input
              type={showTextApiKey ? 'text' : 'password'}
              value={settings.textApiKey}
              onChange={(e) => updateSettings({ textApiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2 pr-10 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
            />
            <button
              onClick={() => setShowTextApiKey(!showTextApiKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            >
              {showTextApiKey ? (
                <EyeOff className="w-4 h-4 text-light-text-sub dark:text-dark-text-sub" />
              ) : (
                <Eye className="w-4 h-4 text-light-text-sub dark:text-dark-text-sub" />
              )}
            </button>
          </div>
          <a
            href={
              settings.textApiProvider === 'openai'
                ? 'https://platform.openai.com/api-keys'
                : settings.textApiProvider === 'anthropic'
                  ? 'https://console.anthropic.com/'
                  : 'https://aistudio.google.com/apikey'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-light-accent dark:text-dark-accent flex items-center gap-1 mt-1"
          >
            APIキーを取得 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* 画像生成AI設定 */}
      <section className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4 space-y-4">
        <h3 className="font-medium text-light-text dark:text-dark-text">
          画像生成AI
        </h3>

        {/* プロバイダー選択 */}
        <div>
          <label className="block text-sm text-light-text-sub dark:text-dark-text-sub mb-1">
            プロバイダー
          </label>
          <select
            value={settings.imageApiProvider}
            onChange={(e) => updateSettings({ imageApiProvider: e.target.value as ImageApiProvider })}
            className="w-full px-3 py-2 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
          >
            <option value="openai">OpenAI (DALL-E 3)</option>
            <option value="stability">Stability AI</option>
          </select>
        </div>

        {/* 画像APIキー */}
        <div>
          <label className="block text-sm text-light-text-sub dark:text-dark-text-sub mb-1">
            APIキー
          </label>
          <div className="relative">
            <input
              type={showImageApiKey ? 'text' : 'password'}
              value={settings.imageApiKey}
              onChange={(e) => updateSettings({ imageApiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2 pr-10 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
            />
            <button
              onClick={() => setShowImageApiKey(!showImageApiKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            >
              {showImageApiKey ? (
                <EyeOff className="w-4 h-4 text-light-text-sub dark:text-dark-text-sub" />
              ) : (
                <Eye className="w-4 h-4 text-light-text-sub dark:text-dark-text-sub" />
              )}
            </button>
          </div>
          <p className="text-xs text-light-text-sub dark:text-dark-text-sub mt-1">
            ※ OpenAI選択時はテキストAIと同じキーを使用できます
          </p>
        </div>
      </section>

      {/* テーマ設定 */}
      <section className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4">
        <h3 className="font-medium text-light-text dark:text-dark-text mb-3">
          テーマ
        </h3>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as ThemeMode[]).map((theme) => (
            <button
              key={theme}
              onClick={() => updateSettings({ theme })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                settings.theme === theme
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text'
              }`}
            >
              {theme === 'light' ? 'ライト' : theme === 'dark' ? 'ダーク' : 'システム'}
            </button>
          ))}
        </div>
      </section>

      {/* データ管理 */}
      <section className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-light-text dark:text-dark-text">
          データ管理
        </h3>

        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg hover:opacity-90"
        >
          <Download className="w-4 h-4" />
          データをエクスポート
        </button>

        <label className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg hover:opacity-90 cursor-pointer">
          <Upload className="w-4 h-4" />
          データをインポート
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        {importError && (
          <p className="text-sm text-red-500">{importError}</p>
        )}

        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          全データを削除
        </button>
      </section>

      {/* アプリ情報 */}
      <section className="text-center text-sm text-light-text-sub dark:text-dark-text-sub">
        <p>{APP_INFO.name} v{APP_INFO.version}</p>
      </section>

      {/* 削除確認モーダル */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-light-bg dark:bg-dark-bg rounded-xl p-4 max-w-sm w-full">
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2">
              全データを削除
            </h3>
            <p className="text-sm text-light-text-sub dark:text-dark-text-sub mb-4">
              すべての夢日記と設定が削除されます。この操作は取り消せません。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-light-bg-sub dark:bg-dark-bg-sub text-light-text dark:text-dark-text rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
