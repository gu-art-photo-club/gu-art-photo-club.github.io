# GitHub Pagesデプロイにおける問題と対応策

## 現在発生している問題

現在、GitHub Pagesへのデプロイ時に以下の3つの問題が発生しています：

1. **CSSが読み込まれずレイアウトが崩れる問題**
2. **ナビゲーションのリンク先が崩れる問題**
3. **gallery.astroのアセットがデプロイ先で表示されない問題**

## 原因分析と対応策

### 1. CSSが読み込まれずレイアウトが崩れる問題

#### 原因

- UnoCSSのビルド設定の問題
- アセットのパス解決が正しく行われていない可能性
- GitHub Pagesでの静的アセット配信が正しく設定されていない

#### 対応策

1. **Astro設定の修正**：

   ```javascript
   // astro.config.mjs
   export default defineConfig({
     site: 'https://gu-art-photo-club.github.io',
     base: '/', // GitHub Organizationサイトでは'/'、通常のリポジトリでは'/リポジトリ名/'
     integrations: [
       react(),
       UnoCSS({
         injectReset: true,
       }),
     ],
     vite: {
       build: {
         // CSS minificationを確実に有効化
         cssMinify: 'lightningcss',
       },
       // CSSチャンクの設定
       css: {
         devSourcemap: true,
       },
     },
   });
   ```

2. **グローバルCSSの読み込み方法の変更**：

   ```javascript
   // 各コンポーネントで直接importする代わりに、Layout.astroでのみimportする
   // Layout.astro
   ---
   import '../styles/globals.css';
   // ...
   ---
   ```

3. **CSSのpreloading追加**：
   ```html
   <!-- Layout.astro のhead内 -->
   <link rel="preload" href="/styles/globals.css" as="style" />
   ```

### 2. ナビゲーションのリンク先が崩れる問題

#### 原因

- BASE_URLの解決が一貫していない
- GitHub Pagesの環境変数とローカル環境の不一致

#### 対応策

1. **astro.config.mjsの確認**：

   ```javascript
   // astro.config.mjs
   export default defineConfig({
     site: 'https://gu-art-photo-club.github.io',
     base: '/', // GitHub Organization用
     // もし通常のGitHubリポジトリの場合は: base: '/gu-art-photo-club/'
   });
   ```

2. **リンクの統一**：

   ```astro
   <!-- すべてのリンクでBASE_URLを一貫して使用 -->
   <a href={`${import.meta.env.BASE_URL}about`}>部活について</a>
   ```

3. **絶対パスの使用**：
   ```astro
   <!-- 可能な限り絶対パスを使用 -->
   <a href="/about">部活について</a>
   <!-- BASE_URLが'/'の場合 -->
   ```

### 3. gallery.astroのアセットがデプロイ先で表示されない問題

#### 原因

- 相対パスの解決方法に問題
- `src/assets/`ディレクトリのファイルがビルド時に正しく扱われていない
- ファイルパスの変換が本番環境で機能していない
- 文字列ベースのパス参照ではViteのアセット最適化が適用されない

#### 対応策

1. **Viteの画像インポート機能を活用**：

   ```javascript
   // src/data/works.ts（改善版）
   import akst000 from '../assets/gallery/akst_000.jpeg';
   import akst001 from '../assets/gallery/akst_001.jpeg';
   // 他の画像も同様にインポート

   export const works = [
     {
       image: akst000,
       displayName: 'anonymous2',
       tags: ['photo'],
     },
     {
       image: akst001,
       displayName: 'anonymous2',
       tags: ['photo'],
     },
     // 他の作品も同様に
   ];
   ```

   ```javascript
   // gallery.astroの改善版
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

2. **画像生成スクリプトの更新**：

   ```typescript
   // scripts/generate-safe-works.ts 修正版
   // ...
   // importステートメントを生成
   const imports: string[] = [];
   const variables: Record<string, string> = {};

   ids.forEach((id, index) => {
     const importVar = `img${index}`;
     const importPath = `../assets/gallery/${id}.jpeg`;
     imports.push(`import ${importVar} from '${importPath}';`);
     variables[id] = importVar;
   });

   // 作品データを生成
   const merged = ids.map(id => {
     // ...
     return {
       image: variables[id], // 変数名を参照
       displayName,
       tags,
     };
   });

   // ファイル出力
   const final = `${imports.join('\n')}\n\nexport const works = ${JSON.stringify(merged, null, 2)};`;
   // ...
   ```

3. **Astro画像の最適化を活用**：

   - サムネイル生成と最適化を自動化
   - WebP変換による容量削減
   - 遅延読み込みのネイティブサポート

4. **画像の動的インポート**：

   ```javascript
   // ランタイムでの動的インポート（代替アプローチ）
   const images = import.meta.glob('../assets/gallery/*.{jpeg,jpg,png,gif}');

   // 使用例
   {
     works.map(work => {
       const imageModule = images[work.imagePath];
       return <div>{imageModule && <img src={imageModule()} alt="作品画像" />}</div>;
     });
   }
   ```

## GitHub Actionsの設定改善

現在の`.github/workflows/deploy.yml`の修正点：

```yaml
- name: Build with Astro
  run: |
    # 環境変数の明示的な設定
    echo "PUBLIC_ENV=production" >> $GITHUB_ENV
    npm run build
  env:
    # 明示的にベースパスを設定
    BASE_URL: '/'

- name: デプロイ前の確認
  run: |
    echo "ビルド結果のディレクトリ構造を確認"
    ls -la dist/
    echo "CSSファイルの存在を確認"
    find dist/ -name "*.css"
```

## 実装方針

上記の問題を解決するために、以下の手順で実装を進めます：

1. **問題の検証**：

   - ローカルでビルド(`npm run build`)して`dist`ディレクトリの内容を確認
   - 404エラーや参照エラーをチェック

2. **修正の優先順位**：

   1. astro.config.mjsの設定修正（ベースパスとサイトURL）
   2. CSS読み込みの問題解決（グローバルCSSの配置と読み込み方法）
   3. 画像アセットパスの修正（Viteのインポート機能活用）

3. **テスト方法**：

   - ローカルでのプレビュー(`npm run preview`)で変更を確認
   - GitHub Actionsのデバッグ出力を活用
   - 段階的な変更とデプロイで問題を分離

4. **長期的解決策**：
   - 画像管理の方法を見直し（Viteのアセット最適化を活用）
   - アセットパイプラインの最適化
   - 開発環境と本番環境の一貫性確保

## Viteの画像最適化メリット

Viteを使った画像インポートアプローチには以下のメリットがあります：

1. **ハッシュ付きファイル名**：長期キャッシングの恩恵
2. **自動最適化**：ビルド時に画像が最適化される
3. **TypeScriptサポート**：型安全性の確保
4. **プリロード**：重要な画像のプリロード
5. **パス解決**：開発環境と本番環境での一貫したパス解決
6. **未使用画像の検出**：使用されていない画像を特定できる
