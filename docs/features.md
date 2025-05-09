# 機能一覧

このドキュメントでは、岐阜大学美術部・写真研究会公式サイトの主要機能とその実装について説明します。

## 1. レスポンシブナビゲーション

### 目的

すべてのデバイスサイズで最適な閲覧体験を提供し、ユーザーが必要な情報に簡単にアクセスできるようにします。

### 実装概要

- **デスクトップ**: 水平ナビゲーションバー（`Layout.astro`で実装）
- **モバイル**: ハンバーガーメニューとオーバーレイナビゲーション（`MobileNav.tsx`で実装）
- 技術: Astro + React（クライアントサイドコンポーネント）

### 関連コード

- `src/layouts/Layout.astro`: メインナビゲーション構造
- `src/components/MobileNav.tsx`: モバイル向けオーバーレイメニュー

## 2. ホームページヒーローセクション

### 目的

サイト訪問者に強い第一印象を与え、サークルの雰囲気を視覚的に伝えます。

### 実装概要

- 全画面背景画像
- オーバーレイテキスト（サークル名と簡単な説明）
- CTA ボタン（ギャラリーと部活紹介へのリンク）
- SNS リンク

### 関連コード

- `src/pages/index.astro`: ヒーローセクションの実装

## 3. 作品ギャラリー

### 目的

部員の作品を魅力的に展示し、サークルの創作活動を視覚的に伝えます。

### 実装概要

- グリッドレイアウトでの画像表示
- 画像クリックで拡大表示（モーダル）
- レスポンシブデザイン（モバイルでは 1 列、タブレットで 2 列、デスクトップで 3 列）
- 遅延読み込み（Lazy Loading）による最適化

### 関連コード

- `src/pages/gallery.astro`: ギャラリーページの実装
- 将来的には画像フィルタリング機能を追加予定

## 4. 部活情報セクション

### 目的

サークルの基本情報（活動日、場所、人数など）を明確に伝えます。

### 実装概要

- アイコン付き情報カード
- 活動概要の説明文
- 部室の場所情報
- 入部案内へのリンク

### 関連コード

- `src/pages/about.astro`: 部活情報ページの実装

## 5. 年間スケジュール表示

### 目的

サークルの年間活動予定を明示し、イベントや展示会の情報を提供します。

### 実装概要

- 時系列形式での表示
- 月別または季節別のグループ化
- イベント名と簡単な説明

### 関連コード

- `src/pages/schedule.astro`: スケジュールページの実装
- 将来的には JSON データからの動的生成を検討

## 6. 入部案内

### 目的

新入部員に向けた情報提供と入部のハードルを下げるためのコンテンツを提供します。

### 実装概要

- 新入部員向けの歓迎メッセージ
- 活動内容の詳細説明
- 見学・入部方法の案内
- 連絡先情報

### 関連コード

- `src/pages/join.astro`: 入部案内ページの実装

## 7. フッターセクション

### 目的

サイト全体のナビゲーションと基本情報へのアクセスを提供します。

### 実装概要

- サイトマップ（全ページへのリンク）
- 連絡先情報
- コピーライト表示
- 大学への所在地リンク

### 関連コード

- `src/layouts/Layout.astro`: フッターセクションの実装
