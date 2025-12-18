import { Moon, Sun } from 'lucide-react';
import { useDreamStore } from '@/stores/dreamStore';
import { APP_INFO } from '@/utils/constants';

export const Header = () => {
  const { effectiveTheme, updateSettings } = useDreamStore();

  const toggleTheme = () => {
    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  return (
    <header className="sticky top-0 z-10 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-light-bg-sub dark:border-dark-bg-sub">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <div>
            <h1 className="text-lg font-bold text-light-text dark:text-dark-text">
              Dream Diary
            </h1>
            <p className="text-xs text-light-text-sub dark:text-dark-text-sub">
              v{APP_INFO.version}
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-light-bg-sub dark:hover:bg-dark-bg-sub transition-colors"
          aria-label="テーマ切り替え"
        >
          {effectiveTheme === 'dark' ? (
            <Sun className="w-5 h-5 text-dark-accent" />
          ) : (
            <Moon className="w-5 h-5 text-light-accent" />
          )}
        </button>
      </div>
    </header>
  );
};
