import type { ImageGenerationResult, ImageApiProvider } from '@/types';
import { generateImageWithDALLE } from './openai';

const STABILITY_API_URL = 'https://api.stability.ai/v2beta';

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
 * 画像生成（プロバイダー統合）
 */
export const generateImage = async (
  prompt: string,
  provider: ImageApiProvider,
  apiKey: string
): Promise<ImageGenerationResult> => {
  switch (provider) {
    case 'openai':
      return generateImageWithDALLE(prompt, apiKey);
    case 'stability':
      return generateImageWithStability(prompt, apiKey);
    default:
      throw new Error(`未対応の画像生成プロバイダー: ${provider}`);
  }
};
