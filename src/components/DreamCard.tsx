import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Calendar } from 'lucide-react';
import type { Dream } from '@/types';
import { useDreamStore } from '@/stores/dreamStore';
import { TAG_COLORS } from '@/utils/constants';
import { formatDateJa, truncateText } from '@/utils/helpers';

interface DreamCardProps {
  dream: Dream;
  compact?: boolean;
}

export const DreamCard = ({ dream, compact = false }: DreamCardProps) => {
  const { deleteDream, effectiveTheme } = useDreamStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isDark = effectiveTheme === 'dark';

  const handleDelete = async () => {
    await deleteDream(dream.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl overflow-hidden animate-fadeIn">
      {/* 画像（あれば） */}
      {dream.imageUrl && !compact && (
        <div className="aspect-video overflow-hidden">
          <img
            src={dream.imageUrl}
            alt="夢のイラスト"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-light-text-sub dark:text-dark-text-sub">
            <Calendar className="w-4 h-4" />
            <span>{formatDateJa(dream.date)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-light-text-sub dark:text-dark-text-sub" />
              ) : (
                <ChevronDown className="w-4 h-4 text-light-text-sub dark:text-dark-text-sub" />
              )}
            </button>

            {!compact && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 rounded hover:bg-light-error/20 dark:hover:bg-dark-error/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-light-text-sub dark:text-dark-text-sub hover:text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* タグ */}
        {dream.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {dream.tags.map((tag) => {
              const colors = TAG_COLORS[tag];
              const colorClass = isDark ? colors.dark : colors.light;
              return (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-xs rounded-full ${colorClass}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* 夢の内容 */}
        <p className="text-sm text-light-text dark:text-dark-text mb-2">
          {isExpanded ? dream.content : truncateText(dream.content, compact ? 50 : 100)}
        </p>

        {/* 展開時の詳細 */}
        {isExpanded && (
          <div className="space-y-3 mt-3 pt-3 border-t border-light-text-sub/10 dark:border-dark-text-sub/10">
            {/* AI解釈 */}
            {dream.interpretation && (
              <div>
                <h4 className="text-xs font-medium text-light-text-sub dark:text-dark-text-sub mb-1">
                  AI解釈
                </h4>
                <p className="text-sm text-light-text dark:text-dark-text whitespace-pre-wrap">
                  {dream.interpretation}
                </p>
              </div>
            )}

            {/* キーワード */}
            {dream.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {dream.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-0.5 text-xs bg-light-accent/20 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* 画像（コンパクトモード時のみここで表示） */}
            {compact && dream.imageUrl && (
              <img
                src={dream.imageUrl}
                alt="夢のイラスト"
                className="w-full rounded-lg"
              />
            )}
          </div>
        )}
      </div>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-light-bg dark:bg-dark-bg rounded-xl p-4 max-w-sm w-full">
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2">
              削除の確認
            </h3>
            <p className="text-sm text-light-text-sub dark:text-dark-text-sub mb-4">
              この夢日記を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-light-bg-sub dark:bg-dark-bg-sub text-light-text dark:text-dark-text rounded-lg hover:opacity-90"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90"
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
