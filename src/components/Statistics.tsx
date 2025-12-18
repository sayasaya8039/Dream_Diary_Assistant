import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStats } from '@/hooks/useStats';
import { useDreamStore } from '@/stores/dreamStore';

// パイチャート用の色
const PIE_COLORS = [
  '#7DD3FC', '#A7F3D0', '#FDE68A', '#FECACA',
  '#C4B5FD', '#FDA4AF', '#93C5FD', '#86EFAC',
];

export const Statistics = () => {
  const { totalDreams, dreamsByMonth, tagDistribution, topKeywords } = useStats();
  const { effectiveTheme } = useDreamStore();
  const isDark = effectiveTheme === 'dark';

  const textColor = isDark ? '#E0F2FE' : '#334155';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div className="p-4 space-y-6 animate-fadeIn">
      <h2 className="text-lg font-bold text-light-text dark:text-dark-text">
        統計・分析
      </h2>

      {/* 概要 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-light-accent dark:text-dark-accent">
            {totalDreams}
          </p>
          <p className="text-sm text-light-text-sub dark:text-dark-text-sub">
            記録した夢
          </p>
        </div>
        <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-light-accent dark:text-dark-accent">
            {topKeywords.length}
          </p>
          <p className="text-sm text-light-text-sub dark:text-dark-text-sub">
            ユニークなキーワード
          </p>
        </div>
      </div>

      {/* 月別グラフ */}
      {dreamsByMonth.length > 0 && (
        <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4">
          <h3 className="text-sm font-medium text-light-text dark:text-dark-text mb-4">
            月別の夢記録数
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dreamsByMonth}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: subTextColor }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: subTextColor }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#F0F9FF',
                    border: 'none',
                    borderRadius: '8px',
                    color: textColor,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={isDark ? '#38BDF8' : '#7DD3FC'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* タグ分布 */}
      {tagDistribution.length > 0 && (
        <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4">
          <h3 className="text-sm font-medium text-light-text dark:text-dark-text mb-4">
            タグの分布
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagDistribution}
                    dataKey="count"
                    nameKey="tag"
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
                  >
                    {tagDistribution.map((entry, index) => (
                      <Cell
                        key={entry.tag}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1">
              {tagDistribution.slice(0, 5).map((item, index) => (
                <div
                  key={item.tag}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-light-text dark:text-dark-text">
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-light-text-sub dark:text-dark-text-sub">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 頻出キーワード */}
      {topKeywords.length > 0 && (
        <div className="bg-light-bg-sub dark:bg-dark-bg-sub rounded-xl p-4">
          <h3 className="text-sm font-medium text-light-text dark:text-dark-text mb-4">
            頻出キーワード
          </h3>
          <div className="flex flex-wrap gap-2">
            {topKeywords.slice(0, 15).map((item) => (
              <span
                key={item.keyword}
                className="px-3 py-1 bg-light-accent/20 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-full text-sm"
                style={{
                  fontSize: `${Math.min(1 + item.count * 0.1, 1.5)}rem`,
                }}
              >
                {item.keyword}
                <span className="ml-1 text-xs opacity-70">({item.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* データなし */}
      {totalDreams === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">📊</span>
          <p className="text-light-text-sub dark:text-dark-text-sub">
            夢を記録すると統計が表示されます
          </p>
        </div>
      )}
    </div>
  );
};
