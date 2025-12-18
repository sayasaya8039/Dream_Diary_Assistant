# Dream Diary Assistant

AIベースの夢日記アシスタント Chrome拡張機能（サイドパネル）

朝起きて夢を入力すると、AIが解釈を提案しイラストを生成して日記化します。

## 機能

- **夢の記録**: 日付とタグを付けて夢を記録
- **AI解釈**: OpenAI GPT-4 または Claude で夢を分析・解釈
- **イラスト生成**: DALL-E 3 または Stability AI で夢のイラストを生成
- **タグ分類**: 楽しい/怖い/不思議/懐かしい/予知夢/悪夢/明晰夢 などでカテゴリ分け
- **統計分析**: 月別の記録数、タグ分布、頻出キーワードをグラフ表示
- **ダーク/ライトモード**: システム設定に連動またはマニュアル切り替え
- **データ管理**: エクスポート/インポート機能

## インストール方法

### 開発版のインストール

1. このリポジトリをクローン
   ```bash
   git clone https://github.com/your-username/Dream_Diary_Assistant.git
   cd Dream_Diary_Assistant
   ```

2. 依存関係をインストール
   ```bash
   npm install
   ```

3. ビルド
   ```bash
   npm run build
   ```

4. Chromeで拡張機能ページを開く
   - `chrome://extensions/` にアクセス
   - 右上の「デベロッパーモード」をON
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `Dream_Diary_Assistant` フォルダ（ビルド出力先）を選択

5. ツールバーの拡張機能アイコンをクリックしてサイドパネルを開く

## 使い方

### 初期設定

1. サイドパネルを開き、「設定」タブへ移動
2. AI APIキーを設定
   - **テキストAI**: OpenAI または Anthropic のAPIキーを入力
   - **画像生成AI**: OpenAI (DALL-E) または Stability AI のAPIキーを入力
3. テーマを選択（ライト/ダーク/システム）

### 夢の記録

1. 「ホーム」タブで夢の内容を入力
2. 日付を確認（デフォルトは今日）
3. 該当するタグを選択
4. 「AIで解析する」ボタンをクリック
5. 解釈結果を確認
6. 必要に応じて「イラストを生成」
7. 「保存する」で日記として保存

### 過去の夢を見る

- 「一覧」タブで全ての夢日記を閲覧
- キーワード検索やタグフィルターで絞り込み

### 統計を確認

- 「統計」タブで記録の傾向を確認
- 月別グラフ、タグ分布、頻出キーワードを表示

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React 18 + TypeScript |
| ビルドツール | Vite + CRXJS |
| スタイリング | Tailwind CSS |
| 状態管理 | Zustand |
| グラフ | Recharts |
| アイコン | Lucide React |

## 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# リント
npm run lint
```

## プロジェクト構成

```
Dream_Diary_Assistant/
├── src/
│   ├── sidepanel/       # サイドパネルUI
│   ├── background/      # Service Worker
│   ├── components/      # Reactコンポーネント
│   ├── hooks/           # カスタムフック
│   ├── services/        # API連携
│   ├── stores/          # 状態管理
│   ├── types/           # 型定義
│   └── utils/           # ユーティリティ
├── manifest.json
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## ライセンス

MIT License

## 作者

Dream Diary Assistant チーム
