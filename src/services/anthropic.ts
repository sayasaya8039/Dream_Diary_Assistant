import type { InterpretationResult } from '@/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1';

/**
 * Claude APIで夢を解釈
 */
export const interpretDreamWithClaude = async (
  dreamContent: string,
  apiKey: string,
  model: string = 'claude-3-5-sonnet-20241022'
): Promise<InterpretationResult> => {
  const response = await fetch(`${ANTHROPIC_API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `あなたは夢分析の専門家です。以下の夢を分析し、JSON形式で回答してください。

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
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude APIエラー');
  }

  const data = await response.json();
  const content = data.content[0].text;

  // JSONを抽出（コードブロックに囲まれている場合も対応）
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('レスポンスからJSONを抽出できませんでした');
  }

  return JSON.parse(jsonMatch[0]);
};
