import { useMemo } from 'react';
import type { DreamStats, DreamTag } from '@/types';
import { useDreamStore } from '@/stores/dreamStore';
import { getMonthName } from '@/utils/helpers';

export const useStats = (): DreamStats => {
  const { dreams } = useDreamStore();

  return useMemo(() => {
    // 総数
    const totalDreams = dreams.length;

    // 月別集計
    const monthMap = new Map<string, number>();
    dreams.forEach((dream) => {
      const date = new Date(dream.date);
      const monthKey = getMonthName(date);
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });

    const dreamsByMonth = Array.from(monthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        // 日付順にソート
        const dateA = new Date(a.month.replace('年', '-').replace('月', ''));
        const dateB = new Date(b.month.replace('年', '-').replace('月', ''));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-12); // 直近12ヶ月

    // タグ分布
    const tagMap = new Map<DreamTag, number>();
    dreams.forEach((dream) => {
      dream.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tagDistribution = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // キーワード頻出
    const keywordMap = new Map<string, number>();
    dreams.forEach((dream) => {
      dream.keywords.forEach((keyword) => {
        keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
      });
    });

    const topKeywords = Array.from(keywordMap.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return {
      totalDreams,
      dreamsByMonth,
      tagDistribution,
      topKeywords,
    };
  }, [dreams]);
};
