# スクリプト改修計画 - Viteの画像インポート機能活用

## 現状の問題点

現在のギャラリー画像管理システムには以下の問題があります：

1. **文字列ベースの画像パス参照**：`"../assets/gallery/akst_000.jpeg"`のような文字列ベースのパス参照
2. **パス解決の不一致**：開発環境と本番環境（GitHub Pages）でのパス解決が一貫していない
3. **Viteの恩恵を受けられていない**：画像最適化やハッシュ付きファイル名などの機能が活用できていない
4. **gallery.astroでのパス変換**：`work.image.replace(/^\.\.\/assets/, '/src/assets')`のような変換が必要

## 改修対象スクリプト

- `scripts/generate-works.ts` - 元の作品データを生成
- `scripts/generate-safe-works.ts` - プライバシーに配慮した公開用データを生成

## 改修内容

### 1. `scripts/generate-works.ts`の改修

現在のスクリプトでは文字列ベースのパスを生成していますが、ESMインポートを活用するように変更します。

```typescript
// 現在
const imports = files.map((file, i) => {
  const varName = `img${i.toString().padStart(3, '0')}`;
  return `import ${varName} from '../assets/gallery/${file}';`;
}).join('\n');

// 改修後
const imports = files.map((file, i) => {
  const varName = `img${i.toString().padStart(3, '0')}`;
  return `import ${varName} from '../assets/gallery/${file}';`;
}).join('\n');

const data = files.map((file, i) => {
  const varName = `img${i.toString().padStart(3, '0')}`;
  const id = file.replace(/\.[^/.]+$/, '');
  // imageを変数参照に
  return `{ image: ${varName}, id: '${id}' }`;
}).join(',\n  ');
```

### 2. `scripts/generate-safe-works.ts`の改修

現在のスクリプトでは文字列パスを抽出して出力していますが、インポート文を生成するように変更します。

```typescript
// 現在
const merged = ids.map((id) => {
  const authorId = id.split('_')[0];
  const author = authors[authorId];
  const displayName = author?.nickname || authorId;
  const tags = author?.category ? [author.category] : [];
  const imgVarName = `img${id.split('_')[1]}`;
  const imagePath = importPaths[imgVarName] || "";
  return {
    image: imagePath,
    displayName,
    tags
  };
});

const final = `export const works = ${JSON.stringify(merged, null, 2)};`;

// 改修後
// importステートメントを生成
const imports: string[] = [];
const variables: Record<string, string> = {};

ids.forEach((id, index) => {
  const fileId = id.split('_')[1];
  const importVar = `img${fileId}`;
  const fileName = `${id}.jpeg`;
  const importPath = `../assets/gallery/${fileName}`;
  imports.push(`import ${importVar} from '${importPath}';`);
  variables[id] = importVar;
});

// 作品データを生成
const merged = ids.map((id) => {
  const authorId = id.split('_')[0];
  const author = authors[authorId];
  const displayName = author?.nickname || authorId;
  const tags = author?.category ? [author.category] : [];
  return {
    // 変数名を参照（文字列ではなくESMインポートの変数）
    image: variables[id],
    displayName,
    tags
  };
});

// ファイル出力（JSONではなくオブジェクトリテラルで出力）
const worksArray = merged.map(work => {
  return `{
    image: ${work.image},
    displayName: "${work.displayName}",
    tags: ${JSON.stringify(work.tags)}
  }`;
}).join(',\n  ');

const final = `${imports.join('\n')}\n\nexport const works = [\n  ${worksArray}\n];`;
```

### 3. `src/pages/gallery.astro`の改修

`gallery.astro`では画像パスの変換が不要になります。代わりにAstroの`Image`コンポーネントを使用して最適化も行います。

```astro
---
import Layout from '../layouts/Layout.astro';
import '@/styles/globals.css';
import { works } from '../data/safeWorks';
import { Image } from 'astro:assets';
---

<Layout title="ギャラリー - 岐阜大学 美術部・写真研究会">
  <!-- ... -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {works.map((work) => (
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
        <!-- ... -->
      </div>
    ))}
  </div>
  <!-- ... -->
</Layout>
```

## 代替アプローチ: 動的インポート

より柔軟な対応が必要な場合は、`import.meta.glob`を利用した動的インポートも検討できます。

```typescript
// src/data/worksWithDynamicImport.ts
const images = import.meta.glob('../assets/gallery/*.{jpeg,jpg,png,gif}', { eager: true });

export const works = [
  {
    imagePath: '../assets/gallery/akst_000.jpeg',
    displayName: 'anonymous2',
    tags: ['photo'],
    // 実行時にパスから画像を解決
    getImage: () => images['../assets/gallery/akst_000.jpeg'] as any
  },
  // ...
];
```

## メリットと期待される効果

1. **型安全性**: TypeScriptによる型チェックが機能するようになる
2. **パス解決の一貫性**: 開発環境と本番環境で同じコードが一貫して動作
3. **自動最適化**: Viteの画像最適化機能により、ビルド時に画像が最適化される
4. **ハッシュ付きファイル名**: 長期キャッシングの恩恵を受けられる
5. **遅延読み込み**: Astroの`Image`コンポーネントにより適切に実装
6. **WebP変換**: 自動的にWebP形式に変換され、ファイルサイズが削減

## 実装手順

1. `scripts/generate-works.ts`の修正
2. 修正したスクリプトでの動作確認（`npm run dev`）
3. `scripts/generate-safe-works.ts`の修正
4. `src/pages/gallery.astro`のImage利用への変更
5. ローカルでのテスト（`npm run dev`, `npm run build`, `npm run preview`）
6. GitHub Pagesへのデプロイテスト

## 注意点

1. **画像ファイル名の一貫性**: IDとファイル名の対応関係に注意
2. **Astro設定の確認**: astro.config.mjsで画像最適化設定が有効になっているか確認
3. **TypeScriptエラー対応**: 必要に応じて型定義の調整
4. **バックアップ**: 修正前のスクリプトはバックアップを取っておく
5. **段階的な変更**: 一度に全ての変更を行わず、段階的に変更してテスト 