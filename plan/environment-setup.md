# 環境構築プラン

## チェックリスト

### 現状確認

- [x] package.json の確認
- [x] astro.config.mjs の確認
- [x] tech-stack.yaml の確認

### 必要な対応

- [x] UnoCSS のインストールと設定（tailwind からの移行）
- [x] unplugin-icons のインストールと設定
- [x] Astro:assets の設定確認
- [x] keen-slider のインストール
- [x] src/data ディレクトリの作成
- [x] import alias の設定確認・追加
- [x] フォーマッター・リンターの設定（prettier, eslint）

## 実施内容

### 1. 依存関係の更新

以下のパッケージをインストールしました：

```bash
# Tailwind関連パッケージの削除
npm uninstall @astrojs/tailwind tailwindcss tailwind-merge tailwindcss-animate

# UnoCSSとその関連パッケージのインストール
npm install -D unocss@0.56.0 @unocss/astro @julr/unocss-preset-forms unocss-preset-shadcn

# アイコンパッケージのインストール
npm install -D unplugin-icons @iconify/json

# その他のパッケージ
npm install keen-slider
npm install -D prettier eslint eslint-plugin-astro @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier-plugin-astro
```

### 2. 設定ファイルの更新

以下の設定ファイルを作成または更新しました：

- `astro.config.mjs` - UnoCSSとunplugin-iconsの設定、import aliasの設定
- `uno.config.ts` - UnoCSSの設定
- `tsconfig.json` - TypeScriptコンパイラオプションの追加
- `.eslintrc.cjs` - ESLintの設定
- `.prettierrc` - Prettierの設定

### 3. グローバルCSSの更新

`src/styles/globals.css`をTailwindからUnoCSSに対応するように更新しました。

### 4. データディレクトリとサンプルデータの作成

以下のファイルを作成しました：

- `src/data/works.ts` - 作品データの型定義とサンプルデータ
- `src/data/schedule.yaml` - 年間スケジュールのデータ

### 5. サーバー起動

開発サーバーを起動して動作確認を行いました。

## 今後の課題

1. 既存コンポーネントのUnoCSSへの移行
2. shadcn/uiコンポーネントの修正
3. 画像アセットの最適化設定
4. ギャラリー機能の強化
