import type { InterpretationResult, ImageGenerationResult, OpenAIImageModel } from '@/types';

const OPENAI_API_URL = 'https://api.openai.com/v1';

/**
 * OpenAI APIで夢を解釈
 */
export const interpretDreamWithOpenAI = async (
  dreamContent: string,
  apiKey: string,
  model: string = 'gpt-4o-mini'
): Promise<InterpretationResult> => {
  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `あなたは夢分析の専門家です。ユーザーの夢を分析し、以下のJSON形式で回答してください：
{
  "interpretation": "夢の解釈（2-3段落で詳しく説明）",
  "keywords": ["キーワード1", "キーワード2", "キーワード3"],
  "imagePrompt": "この夢を表現するイラスト生成用の英語プロンプト（幻想的で美しい描写、50語以内）"
}
夢の象徴的な意味、心理学的な観点、そして夢主へのメッセージを含めてください。`,
        },
        {
          role: 'user',
          content: `以下の夢を分析してください：\n\n${dreamContent}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI APIエラー');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
};

/**
 * OpenAI画像生成（DALL-E 3 / GPT-Image-1.5）
 */
export const generateImageWithDALLE = async (
  prompt: string,
  apiKey: string,
  model: OpenAIImageModel = 'dall-e-3'
): Promise<ImageGenerationResult> => {
  const enhancedPrompt = `Dreamy, ethereal illustration: ${prompt}. Style: soft watercolor, pastel colors, magical atmosphere, surreal and peaceful.`;

  // GPT-Image-1.5とDALL-E 3で設定を分ける
  const requestBody: Record<string, unknown> = {
    model,
    prompt: enhancedPrompt,
    n: 1,
    response_format: 'b64_json',
  };

  // モデルごとの設定
  if (model === 'gpt-image-1.5') {
    // GPT-Image-1.5は高解像度対応
    requestBody.size = '1536x1024';
    requestBody.quality = 'high';
  } else {
    // DALL-E 3
    requestBody.size = '1024x1024';
    requestBody.quality = 'standard';
  }

  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI画像生成APIエラー');
  }

  const data = await response.json();
  const imageData = data.data[0];

  return {
    imageUrl: `data:image/png;base64,${imageData.b64_json}`,
    revisedPrompt: imageData.revised_prompt,
  };
};
