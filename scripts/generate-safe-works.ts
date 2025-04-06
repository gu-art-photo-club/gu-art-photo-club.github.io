import fs from 'fs';
import path from 'path';

// 作品の型定義
interface Work {
  id: string;
}

// 著者の型定義
interface Author {
  name: string;
  nickname?: string;
  category?: string;
}

// 出力用の型定義
interface SafeWork {
  image: string;
  displayName: string;
  tags: string[];
}

const authorsPath = path.resolve('private/authors.json');
const worksPath = path.resolve('src/data/works.ts');
const output = path.resolve('src/data/safeWorks.ts');

try {
  // 作品のimportを抽出
  const worksContent = fs.readFileSync(worksPath, 'utf-8');
  
  // 正規表現でIDを抽出
  const idRegex = /'([^']+_\d+)'/g;
  const ids: string[] = [];
  let match;
  
  while ((match = idRegex.exec(worksContent)) !== null) {
    ids.push(match[1]);
  }
  
  console.log(`作品ID: ${ids.join(', ')}`);
  
  if (ids.length === 0) {
    throw new Error('作品IDが見つかりませんでした');
  }
  
  // importの抽出
  const importPaths: Record<string, string> = {};
  const importRegex = /import\s+(\w+)\s+from\s+'([^']+)'/g;
  
  while ((match = importRegex.exec(worksContent)) !== null) {
    const varName = match[1];
    const path = match[2];
    importPaths[varName] = path;
  }
  
  // 著者情報の読み込み
  const authors = JSON.parse(fs.readFileSync(authorsPath, 'utf-8')) as Record<string, Author>;

  const merged = ids.map((id) => {
    const authorId = id.split('_')[0];
    const author = authors[authorId];

    // nameは個人情報なので使用しない
    // nicknameのみ使用し、なければauthorIdを使用
    const displayName = author?.nickname || authorId;
    const tags = author?.category ? [author.category] : [];

    // importされた画像パスを使用
    const imgVarName = `img${id.split('_')[1]}`;
    const imagePath = importPaths[imgVarName] || "";

    return {
      image: imagePath,
      displayName,
      tags
    };
  });

  const final = `export const works = ${JSON.stringify(merged, null, 2)};`;

  fs.writeFileSync(output, final);
  console.log('✅ safeWorks.ts with tags generated!');
} catch (error: unknown) {
  console.error('エラーが発生しました:', error);
  // スタックトレースを表示
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
}
