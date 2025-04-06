import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名を結合するユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ページへのURLを生成する関数
 * GitHub Pages対応のため、BASE_URLを考慮したパスを生成します
 */
export function getPageUrl(path: string): string {
  // パスの先頭の / を取り除く（必要な場合）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // BASE_URLの末尾の / とパスの先頭の / が重複しないように結合
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
