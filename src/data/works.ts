// 作品カテゴリの定義
export type WorkCategory =
  | "painting" // 絵画
  | "digital" // デジタル
  | "photo" // 写真
  | "illustration" // イラスト
  | "other"; // その他

// 作品データの型定義
export interface Work {
  id: string;
  title: string;
  artist: string;
  category: WorkCategory;
  imageUrl: string;
  year?: number;
  description?: string;
  tags?: string[];
}

// サンプルデータ
export const works: Work[] = [
  {
    id: "1",
    title: "風景",
    artist: "山田太郎",
    category: "painting",
    imageUrl: "/images/works/landscape.jpg",
    year: 2023,
    description: "岐阜の美しい風景を描いた作品です。",
    tags: ["風景", "油絵", "自然"],
  },
  {
    id: "2",
    title: "夏の思い出",
    artist: "佐藤花子",
    category: "photo",
    imageUrl: "/images/works/summer.jpg",
    year: 2023,
    description: "夏休みの思い出を写真に収めました。",
    tags: ["夏", "自然", "ポートレート"],
  },
  {
    id: "3",
    title: "デジタルアート作品",
    artist: "鈴木一郎",
    category: "digital",
    imageUrl: "/images/works/digital.jpg",
    year: 2022,
    description: "コンピュータで制作したデジタルアート。",
    tags: ["デジタル", "抽象", "グラフィック"],
  },
];

// カテゴリー別に作品を取得する関数
export function getWorksByCategory(category?: WorkCategory): Work[] {
  if (!category) return works;
  return works.filter((work) => work.category === category);
}

// 特定のIDの作品を取得する関数
export function getWorkById(id: string): Work | undefined {
  return works.find((work) => work.id === id);
}

// 最新の作品を取得する関数（表示数指定可能）
export function getLatestWorks(count: number = 6): Work[] {
  return [...works]
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, count);
}
