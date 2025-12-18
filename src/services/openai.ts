import type { InterpretationResult, ImageGenerationResult } from '@/types';

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
 * DALL-E 3で画像生成
 */
export const generateImageWithDALLE = async (
  prompt: string,
  apiKey: string
): Promise<ImageGenerationResult> => {
  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: `Dreamy, ethereal illustration: ${prompt}. Style: soft watercolor, pastel colors, magical atmosphere, surreal and peaceful.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'DALL-E APIエラー');
  }

  const data = await response.json();
  const imageData = data.data[0];

  return {
    imageUrl: `data:image/png;base64,${imageData.b64_json}`,
    revisedPrompt: imageData.revised_prompt,
  };
};
