// UUID生成
export const generateId = (): string => {
  return crypto.randomUUID();
};

// 今日の日付をYYYY-MM-DD形式で取得
export const getTodayDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// 日付を日本語形式にフォーマット
export const formatDateJa = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

// 相対日時を取得
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (minutes > 0) return `${minutes}分前`;
  return 'たった今';
};

// テキストを指定文字数で切り詰め
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// システムテーマを取得
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// 月名を取得
export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' });
};
