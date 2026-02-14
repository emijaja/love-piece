# 概要

このシステムは、大切な人に思い出のメッセージを送るシステムである。
複数の画像やいくつかの項目の内容をもとに大切な相手へのメッセージを作成します。

## 機能

- 📸 写真のアップロード
- いくつかの項目を入力する（ex. 相手との関係性）
- 👁️ 画像プレビュー表示
- APIリクエスト時にWaiting画面
- ✍️ Gemini API を使った文章の自動生成
- 📋 生成された文章のコピー
- 🔄 文章の再生成
- 今後結果ページを作成して相手にページを共有することができるように

## UI

`shadcn`を用いて基本的に構成する

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Gemini API キーの設定

詳細なセットアップ手順は [README_SETUP.md](README_SETUP.md) をご覧ください。

```bash
# .env.local ファイルを作成
cp .env.local.example .env.local

# .env.local を編集して API キーを設定
# GEMINI_API_KEY=あなたのAPIキー
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。
