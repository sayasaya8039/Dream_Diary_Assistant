import { useState } from 'react';
import { Sparkles, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { useDreamStore } from '@/stores/dreamStore';
import { useAI } from '@/hooks/useAI';
import { TagSelector } from './TagSelector';
import type { Dream, DreamTag } from '@/types';
import { generateId, getTodayDate } from '@/utils/helpers';

export const DreamInput = () => {
  const { addDream, settings } = useDreamStore();
  const { interpretDream, generateDreamImage, isInterpreting, isGeneratingImage, interpretError, imageError } = useAI();

  const [content, setContent] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [selectedTags, setSelectedTags] = useState<DreamTag[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [step, setStep] = useState<'input' | 'interpreted' | 'complete'>('input');

  const hasApiKey = !!settings.textApiKey;
  const hasImageApiKey = !!settings.imageApiKey;

  const handleInterpret = async () => {
    if (!content.trim()) return;

    const result = await interpretDream(content);
    if (result) {
      setInterpretation(result.interpretation);
      setKeywords(result.keywords);
      setImagePrompt(result.imagePrompt);
      setStep('interpreted');
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;

    const result = await generateDreamImage(imagePrompt);
    if (result) {
      setImageUrl(result.imageUrl);
    }
  };

  const handleSave = async () => {
    const dream: Dream = {
      id: generateId(),
      date,
      content,
      interpretation,
      imageUrl,
      imagePrompt,
      tags: selectedTags,
      keywords,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addDream(dream);

    // リセット
    setContent('');
    setDate(getTodayDate());
    setSelectedTags([]);
    setInterpretation('');
    setKeywords([]);
    setImageUrl('');
    setImagePrompt('');
    setStep('input');
  };

  return (
    <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4 space-y-4">
      {/* 日付選択 */}
      <div>
        <label className="block text-sm font-medium text-light-text-sub dark:text-dark-text-sub mb-1">
          日付
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
        />
      </div>

      {/* 夢の内容入力 */}
      <div>
        <label className="block text-sm font-medium text-light-text-sub dark:text-dark-text-sub mb-1">
          夢の内容
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今朝見た夢を詳しく書いてください..."
          rows={5}
          className="w-full px-3 py-2 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder:text-light-text-sub/50 dark:placeholder:text-dark-text-sub/50 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent resize-none"
        />
      </div>

      {/* タグ選択 */}
      <TagSelector selected={selectedTags} onChange={setSelectedTags} />

      {/* エラー表示 */}
      {interpretError && (
        <p className="text-sm text-red-500 dark:text-red-400">{interpretError}</p>
      )}

      {/* AI解釈結果 */}
      {step !== 'input' && interpretation && (
        <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-3 space-y-3">
          <h3 className="font-medium text-light-text dark:text-dark-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-light-accent dark:text-dark-accent" />
            AIによる解釈
          </h3>
          <p className="text-sm text-light-text-sub dark:text-dark-text-sub whitespace-pre-wrap">
            {interpretation}
          </p>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 text-xs bg-light-accent/20 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 生成画像 */}
      {imageUrl && (
        <div className="rounded-lg overflow-hidden">
          <img src={imageUrl} alt="夢のイラスト" className="w-full" />
        </div>
      )}

      {imageError && (
        <p className="text-sm text-red-500 dark:text-red-400">{imageError}</p>
      )}

      {/* アクションボタン */}
      <div className="flex gap-2">
        {step === 'input' && (
          <button
            onClick={handleInterpret}
            disabled={!content.trim() || isInterpreting || !hasApiKey}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInterpreting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                解析中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {hasApiKey ? 'AIで解析する' : 'APIキーを設定してください'}
              </>
            )}
          </button>
        )}

        {step === 'interpreted' && !imageUrl && hasImageApiKey && (
          <button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isGeneratingImage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                イラストを生成
              </>
            )}
          </button>
        )}

        {step !== 'input' && (
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            保存する
          </button>
        )}
      </div>
    </div>
  );
};
