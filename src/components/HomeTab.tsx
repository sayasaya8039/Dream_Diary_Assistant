import { useState } from 'react';
import { DreamInput } from './DreamInput';
import { DreamCard } from './DreamCard';
import { useDreamStore } from '@/stores/dreamStore';

export const HomeTab = () => {
  const { dreams } = useDreamStore();
  const [showInput, setShowInput] = useState(true);

  // 最近の夢（直近3件）
  const recentDreams = dreams.slice(0, 3);

  return (
    <div className="p-4 space-y-6 animate-fadeIn">
      {/* 夢入力セクション */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-light-text dark:text-dark-text">
            今日の夢を記録
          </h2>
          <button
            onClick={() => setShowInput(!showInput)}
            className="text-sm text-light-accent dark:text-dark-accent hover:underline"
          >
            {showInput ? '閉じる' : '開く'}
          </button>
        </div>

        {showInput && <DreamInput />}
      </section>

      {/* 最近の夢 */}
      {recentDreams.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
            最近の夢
          </h2>
          <div className="space-y-3">
            {recentDreams.map((dream) => (
              <DreamCard key={dream.id} dream={dream} compact />
            ))}
          </div>
        </section>
      )}

      {/* 空の状態 */}
      {dreams.length === 0 && !showInput && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🌙</span>
          <p className="text-light-text-sub dark:text-dark-text-sub">
            まだ夢の記録がありません
          </p>
          <button
            onClick={() => setShowInput(true)}
            className="mt-4 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            最初の夢を記録する
          </button>
        </div>
      )}
    </div>
  );
};
