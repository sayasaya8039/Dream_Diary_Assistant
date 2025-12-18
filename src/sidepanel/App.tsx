import { useEffect } from 'react';
import { useDreamStore } from '@/stores/dreamStore';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { HomeTab } from '@/components/HomeTab';
import { DreamList } from '@/components/DreamList';
import { Statistics } from '@/components/Statistics';
import { Settings } from '@/components/Settings';

const App = () => {
  const { currentTab, effectiveTheme, isLoading, error, initialize, setError } = useDreamStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // テーマをHTML要素に適用
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [effectiveTheme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-bg dark:bg-dark-bg">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-light-text-sub dark:text-dark-text-sub">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col">
      <Header />

      {/* エラー通知 */}
      {error && (
        <div className="mx-4 mt-2 p-3 bg-light-error dark:bg-dark-error/20 text-red-700 dark:text-red-300 rounded-lg text-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto pb-20">
        {currentTab === 'home' && <HomeTab />}
        {currentTab === 'list' && <DreamList />}
        {currentTab === 'stats' && <Statistics />}
        {currentTab === 'settings' && <Settings />}
      </main>

      <Navigation />
    </div>
  );
};

export default App;
