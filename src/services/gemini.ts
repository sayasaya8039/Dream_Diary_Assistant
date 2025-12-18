import type { InterpretationResult } from '@/types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Gemini APIで夢を解釈
 */
export const interpretDreamWithGemini = async (
  dreamContent: string,
  apiKey: string,
  model: string = 'gemini-3-flash'
): Promise<InterpretationResult> => {
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
                text: `あなたは夢分析の専門家です。以下の夢を分析し、JSON形式で回答してください。

夢の内容：
${dreamContent}

以下のJSON形式で回答してください（他の文章は不要です）：
{
  "interpretation": "夢の解釈（2-3段落で詳しく説明。象徴的な意味、心理学的な観点、夢主へのメッセージを含める）",
  "keywords": ["キーワード1", "キーワード2", "キーワード3"],
  "imagePrompt": "この夢を表現するイラスト生成用の英語プロンプト（幻想的で美しい描写、50語以内）"
}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini APIエラー');
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Geminiからの応答が空です');
  }

  // JSONを抽出（コードブロックに囲まれている場合も対応）
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('レスポンスからJSONを抽出できませんでした');
  }

  return JSON.parse(jsonMatch[0]);
};
