import { useState, useCallback } from 'react';
import type { InterpretationResult, ImageGenerationResult } from '@/types';
import { useDreamStore } from '@/stores/dreamStore';
import { interpretDreamWithOpenAI } from '@/services/openai';
import { interpretDreamWithClaude } from '@/services/anthropic';
import { generateImage } from '@/services/imageGeneration';

interface UseAIReturn {
  isInterpreting: boolean;
  isGeneratingImage: boolean;
  interpretError: string | null;
  imageError: string | null;
  interpretDream: (content: string) => Promise<InterpretationResult | null>;
  generateDreamImage: (prompt: string) => Promise<ImageGenerationResult | null>;
}

export const useAI = (): UseAIReturn => {
  const { settings } = useDreamStore();
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [interpretError, setInterpretError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const interpretDream = useCallback(
    async (content: string): Promise<InterpretationResult | null> => {
      if (!settings.textApiKey) {
        setInterpretError('APIキーが設定されていません。設定画面でAPIキーを入力してください。');
        return null;
      }

      setIsInterpreting(true);
      setInterpretError(null);

      try {
        let result: InterpretationResult;

        if (settings.textApiProvider === 'openai') {
          result = await interpretDreamWithOpenAI(
            content,
            settings.textApiKey,
            settings.textModel
          );
        } else {
          result = await interpretDreamWithClaude(
            content,
            settings.textApiKey,
            settings.textModel
          );
        }

        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : '夢の解釈に失敗しました';
        setInterpretError(message);
        return null;
      } finally {
        setIsInterpreting(false);
      }
    },
    [settings]
  );

  const generateDreamImage = useCallback(
    async (prompt: string): Promise<ImageGenerationResult | null> => {
      if (!settings.imageApiKey) {
        setImageError('画像生成APIキーが設定されていません。');
        return null;
      }

      setIsGeneratingImage(true);
      setImageError(null);

      try {
        const result = await generateImage(
          prompt,
          settings.imageApiProvider,
          settings.imageApiKey
        );
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : '画像生成に失敗しました';
        setImageError(message);
        return null;
      } finally {
        setIsGeneratingImage(false);
      }
    },
    [settings]
  );

  return {
    isInterpreting,
    isGeneratingImage,
    interpretError,
    imageError,
    interpretDream,
    generateDreamImage,
  };
};
