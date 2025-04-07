# ルーティング設定ドキュメント

## ルーティングの基本

当サイトでは、Astroのファイルベースルーティングを採用しています。`src/pages/`ディレクトリ内のファイル構造がそのままURLパスに対応します。

### 現在のページ構成

| ファイルパス               | URL         | 説明                 |
| -------------------------- | ----------- | -------------------- |
| `src/pages/index.astro`    | `/`         | ホームページ         |
| `src/pages/about.astro`    | `/about`    | 部活紹介ページ       |
| `src/pages/gallery.astro`  | `/gallery`  | 作品ギャラリーページ |
| `src/pages/schedule.astro` | `/schedule` | 年間予定ページ       |
| `src/pages/join.astro`     | `/join`     | 入部案内ページ       |

## 環境別URL設定

### ローカル開発環境（開発時）

- **ベースURL**: `/`（ルートディレクトリ）
- **アクセス方法**: `http://localhost:4321/`
- **設定方法**: `npm run dev`でローカルサーバーを起動

### 本番環境（GitHub Pages）

- **ベースURL**: `/`（ルートディレクトリ）
- **サイトURL**: `https://gu-art-photo-club.github.io/`
- **設定ファイル**: `astro.config.mjs`で以下の設定

```js
export default defineConfig({
  site: 'https://gu-art-photo-club.github.io',
  base: '/',
  // 他の設定...
});
```

## 環境変数の扱い

環境変数`import.meta.env.BASE_URL`を使用してリンクを構築することで、開発環境と本番環境の違いを吸収しています。

### 使用例

```astro
<a href={`${import.meta.env.BASE_URL}about`}>部活について</a>
```

この方法により、開発環境と本番環境の両方で正しくリンクが機能します。

## 静的アセットの参照

- **静的アセット**: `public`ディレクトリに配置
- **参照方法**: `${import.meta.env.BASE_URL}assets/image.jpg`

### 例

```astro
<img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="favicon" />
```

## 注意事項

1. **相対パス vs 絶対パス**:

   - 内部リンクには必ず`${import.meta.env.BASE_URL}`を使用
   - 外部リンクには完全なURLを使用（例: `https://example.com`）

2. **ビルド時の最適化**:

   - ビルド時にすべてのリンクが正しく解決されることを確認
   - 404エラーを避けるため、存在しないパスへのリンクをチェック

3. **カスタムドメイン対応**:
   - 将来的にカスタムドメインを使用する場合も、現在の設定で対応可能
   - CloudflareのDNS設定とリダイレクトで連携

## トラブルシューティング

- 404エラーが発生する場合は、以下を確認：
  - リンクに`import.meta.env.BASE_URL`が使用されているか
  - ファイルが正しいディレクトリに配置されているか
  - ビルド後のファイル構造がURLパスと一致しているか
