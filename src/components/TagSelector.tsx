import type { DreamTag } from '@/types';
import { DREAM_TAGS, TAG_COLORS } from '@/utils/constants';
import { useDreamStore } from '@/stores/dreamStore';

interface TagSelectorProps {
  selected: DreamTag[];
  onChange: (tags: DreamTag[]) => void;
}

export const TagSelector = ({ selected, onChange }: TagSelectorProps) => {
  const { effectiveTheme } = useDreamStore();
  const isDark = effectiveTheme === 'dark';

  const toggleTag = (tag: DreamTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-light-text-sub dark:text-dark-text-sub mb-2">
        タグ（複数選択可）
      </label>
      <div className="flex flex-wrap gap-2">
        {DREAM_TAGS.map((tag) => {
          const isSelected = selected.includes(tag);
          const colors = TAG_COLORS[tag];
          const colorClass = isDark ? colors.dark : colors.light;

          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                isSelected
                  ? colorClass
                  : 'bg-light-bg dark:bg-dark-bg text-light-text-sub dark:text-dark-text-sub hover:bg-light-bg-sub dark:hover:bg-dark-bg-sub'
              } ${isSelected ? 'ring-2 ring-offset-1 ring-light-accent dark:ring-dark-accent' : ''}`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
