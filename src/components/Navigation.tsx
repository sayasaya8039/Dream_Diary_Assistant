import { Home, List, BarChart3, Settings } from 'lucide-react';
import { useDreamStore } from '@/stores/dreamStore';
import type { TabType } from '@/types';

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'list', label: '一覧', icon: List },
  { id: 'stats', label: '統計', icon: BarChart3 },
  { id: 'settings', label: '設定', icon: Settings },
];

export const Navigation = () => {
  const { currentTab, setCurrentTab } = useDreamStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-light-bg dark:bg-dark-bg border-t border-light-bg-sub dark:border-dark-bg-sub">
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => setCurrentTab(id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-light-accent dark:text-dark-accent'
                  : 'text-light-text-sub dark:text-dark-text-sub hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
