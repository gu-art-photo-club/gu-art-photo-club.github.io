# Vite画像インポート実装手順

## 概要

GitHub Pagesデプロイ時のギャラリー画像表示問題を解決するため、Viteの画像インポート機能を活用した実装に移行します。これにより、以下のメリットが得られます：

- 開発環境と本番環境での一貫したパス解決
- 画像の自動最適化とキャッシュ効率の向上
- TypeScript環境での型安全性確保
- 遅延読み込みとパフォーマンス最適化

## 実装ステップ

### ステップ1: データ生成スクリプトの修正

#### ✅ `scripts/generate-works.ts`

このスクリプトは、元の作品データを生成します。変更点は以下のとおりです：

- 画像パスを文字列ではなく、ESMインポートの変数として参照するように変更
- 出力形式をオブジェクトリテラル形式に変更（文字列ではなく変数そのものを参照）

```bash
# スクリプト実行
npm run generate-works # または、ts-node scripts/generate-works.ts
```

#### ✅ `scripts/generate-safe-works.ts`

このスクリプトは、プライバシーに配慮した公開用データを生成します。変更点は以下のとおりです：

- 画像パスを文字列ではなく、ESMインポート変数として参照
- 画像変数名の正確な生成 (`img001`のような形式)
- オブジェクトリテラル形式での出力

```bash
# スクリプト実行
npm run generate-safe-works # または、ts-node scripts/generate-safe-works.ts
```

### ステップ2: ギャラリーコンポーネントの修正

#### `src/pages/gallery.astro`

ギャラリーページのコンポーネントを修正し、以下の変更を行います：

1. Astroの`Image`コンポーネントのインポート追加
2. 画像パス変換処理の削除
3. `<img>`タグを`<Image>`コンポーネントに置き換え
4. 最適化オプション（幅、形式など）の設定

```astro
---
import Layout from '../layouts/Layout.astro';
import '@/styles/globals.css';
import { works } from '../data/safeWorks';
import { Image } from 'astro:assets';
---

<Layout title="ギャラリー - 岐阜大学 美術部・写真研究会">
  <main class="min-h-screen pt-16">
    <section class="py-12 sm:py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-bold mb-8">ギャラリー</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            works.map(work => (
              <div class="group">
                <div class="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                  <Image
                    src={work.image}
                    alt="作品画像"
                    width={800}
                    format="webp"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div class="px-1">
                  <h3 class="font-medium text-lg">{work.displayName || '作者非公開'}</h3>

                  <div class="flex flex-wrap gap-1 mt-1">
                    {work.tags?.map(tag => (
                      <span class="bg-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  </main>
</Layout>
```

### ステップ3: Astro設定の確認

#### `astro.config.mjs`

Astroの設定ファイルで、画像最適化が有効になっていることを確認します：

```javascript
export default defineConfig({
  site: 'https://gu-art-photo-club.github.io',
  base: '/',
  // 他の設定...

  // 画像最適化の設定を確認
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    format: ['webp'],
  },
  // ...
});
```

### ステップ4: ローカルでのテスト

以下の手順で、ローカル環境でテストします：

1. スクリプト実行による新しいデータファイル生成

   ```bash
   npm run generate-works
   npm run generate-safe-works
   ```

2. 開発サーバー起動

   ```bash
   npm run dev
   ```

3. ギャラリーページにアクセスして動作確認

   - 画像が正しく表示されるか
   - デベロッパーツールでネットワークタブを確認
   - 生成されたHTML/CSSを確認

4. ビルド・プレビューでの確認
   ```bash
   npm run build
   npm run preview
   ```

### ステップ5: 本番環境へのデプロイ

1. 修正をコミット

   ```bash
   git add .
   git commit -m "Refactor gallery images to use Vite ESM imports"
   ```

2. GitHub Actionsによる自動デプロイを待機

3. デプロイ後の確認
   - 本番環境でギャラリーページにアクセス
   - 画像が正常に表示されるか確認
   - ネットワークタブでリクエスト状況を確認（404エラーがないか）

## トラブルシューティング

### 問題: 画像インポートが解決されない

**確認事項**:

- `src/assets/gallery/` に画像ファイルが存在するか
- ファイル名とインポートパスが一致しているか
- TypeScriptエラーが発生していないか

**解決策**:

- エラーメッセージを確認
- ファイルパスの確認と修正
- 必要に応じて型定義の調整

### 問題: Astroのイメージコンポーネントでエラー

**確認事項**:

- Astroのバージョンが最新か
- `astro:assets` をインポートしているか
- 画像のサイズやフォーマットが適切か

**解決策**:

- Astroのアップデート
- 設定ファイルの確認
- フォールバックとして標準の`<img>`タグを試用

## 将来の拡張計画

1. **画像プレビュー機能**:

   - クリックで拡大表示する機能の追加
   - Reactコンポーネントとしてモーダルビューアーを実装

2. **カテゴリフィルター**:

   - タグベースのフィルタリング機能
   - 作者別の表示・非表示切り替え

3. **画像最適化のさらなる向上**:

   - プレースホルダー画像の導入
   - 解像度に応じた複数サイズの生成

4. **動的インポートの検討**:
   - `import.meta.glob`を使用した柔軟なインポート戦略
   - 必要に応じたコード分割の導入
