import type { ImageGenerationResult, ImageApiProvider, GeminiImageModel, OpenAIImageModel } from '@/types';
import { generateImageWithDALLE } from './openai';

const STABILITY_API_URL = 'https://api.stability.ai/v2beta';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Stability AIで画像生成
 */
export const generateImageWithStability = async (
  prompt: string,
  apiKey: string
): Promise<ImageGenerationResult> => {
  const response = await fetch(`${STABILITY_API_URL}/stable-image/generate/core`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
    body: (() => {
      const formData = new FormData();
      formData.append('prompt', `Dreamy, ethereal illustration: ${prompt}. Style: soft watercolor, pastel colors, magical atmosphere, surreal and peaceful.`);
      formData.append('output_format', 'png');
      formData.append('aspect_ratio', '1:1');
      return formData;
    })(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Stability AI APIエラー');
  }

  const data = await response.json();

  return {
    imageUrl: `data:image/png;base64,${data.image}`,
  };
};

/**
 * Gemini ネイティブ画像生成（gemini-2.5-flash-image / gemini-3-pro-image-preview）
 */
export const generateImageWithGemini = async (
  prompt: string,
  apiKey: string,
  model: GeminiImageModel = 'gemini-2.5-flash-image'
): Promise<ImageGenerationResult> => {
  const enhancedPrompt = `Dreamy, ethereal illustration: ${prompt}. Style: soft watercolor, pastel colors, magical atmosphere, surreal and peaceful.`;

  // gemini-3-pro-image-previewは高解像度対応
  const imageConfig: Record<string, string> = {
    aspectRatio: '1:1',
  };
  if (model === 'gemini-3-pro-image-preview') {
    imageConfig.imageSize = '2K';
  }

  const response = await fetch(
    `${GEMINI_API_URL}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'Gemini画像生成APIエラー');
  }

  const data = await response.json();

  // レスポンスから画像データを抽出
  const candidates = data.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('画像が生成されませんでした');
  }

  const parts = candidates[0].content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('画像データが見つかりません');
  }

  // 画像パートを探す
  const imagePart = parts.find((part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData);
  if (!imagePart || !imagePart.inlineData) {
    throw new Error('画像データが含まれていません');
  }

  const { mimeType, data: imageData } = imagePart.inlineData;

  return {
    imageUrl: `data:${mimeType};base64,${imageData}`,
  };
};

/**
 * 画像生成オプション
 */
export interface GenerateImageOptions {
  prompt: string;
  provider: ImageApiProvider;
  apiKey: string;
  geminiImageModel?: GeminiImageModel;
  openaiImageModel?: OpenAIImageModel;
}

/**
 * 画像生成（プロバイダー統合）
 */
export const generateImage = async (
  options: GenerateImageOptions
): Promise<ImageGenerationResult> => {
  const { prompt, provider, apiKey, geminiImageModel, openaiImageModel } = options;

  switch (provider) {
    case 'openai':
      return generateImageWithDALLE(prompt, apiKey, openaiImageModel);
    case 'stability':
      return generateImageWithStability(prompt, apiKey);
    case 'gemini':
      return generateImageWithGemini(prompt, apiKey, geminiImageModel);
    default:
      throw new Error(`未対応の画像生成プロバイダー: ${provider}`);
  }
};
