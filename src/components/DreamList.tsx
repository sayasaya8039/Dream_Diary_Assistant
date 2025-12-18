import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useDreamStore } from '@/stores/dreamStore';
import { DreamCard } from './DreamCard';
import type { DreamTag } from '@/types';
import { DREAM_TAGS, TAG_COLORS } from '@/utils/constants';

export const DreamList = () => {
  const { dreams, effectiveTheme } = useDreamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<DreamTag[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const isDark = effectiveTheme === 'dark';

  const filteredDreams = useMemo(() => {
    return dreams.filter((dream) => {
      // テキスト検索
      const matchesSearch =
        !searchQuery ||
        dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.interpretation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      // タグフィルター
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => dream.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [dreams, searchQuery, selectedTags]);

  const toggleTag = (tag: DreamTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <div className="p-4 space-y-4 animate-fadeIn">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-light-text dark:text-dark-text">
          夢日記一覧
        </h2>
        <span className="text-sm text-light-text-sub dark:text-dark-text-sub">
          {filteredDreams.length}件
        </span>
      </div>

      {/* 検索バー */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-sub dark:text-dark-text-sub" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="キーワードで検索..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-light-text-sub/20 dark:border-dark-text-sub/20 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder:text-light-text-sub/50 dark:placeholder:text-dark-text-sub/50 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border transition-colors ${
            selectedTags.length > 0
              ? 'border-light-accent dark:border-dark-accent bg-light-accent/10 dark:bg-dark-accent/10'
              : 'border-light-text-sub/20 dark:border-dark-text-sub/20'
          }`}
        >
          <Filter className="w-5 h-5 text-light-text-sub dark:text-dark-text-sub" />
        </button>
      </div>

      {/* フィルター */}
      {showFilters && (
        <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-light-text dark:text-dark-text">
              タグでフィルター
            </span>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-xs text-light-accent dark:text-dark-accent flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                クリア
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {DREAM_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const colors = TAG_COLORS[tag];
              const colorClass = isDark ? colors.dark : colors.light;

              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    isSelected
                      ? colorClass
                      : 'bg-light-bg dark:bg-dark-bg text-light-text-sub dark:text-dark-text-sub'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 夢一覧 */}
      <div className="space-y-3">
        {filteredDreams.length > 0 ? (
          filteredDreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))
        ) : (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-light-text-sub dark:text-dark-text-sub">
              {dreams.length === 0
                ? 'まだ夢の記録がありません'
                : '条件に一致する夢がありません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
