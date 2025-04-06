import {
  defineConfig,
  presetUno,
  presetTypography,
  presetWebFonts,
} from "unocss";
import { presetForms } from "@julr/unocss-preset-forms";
import { presetShadcn } from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetUno(), // Tailwind互換のプリセット
    presetTypography(), // Markdown/テキストスタイリング用
    presetForms(), // フォーム要素のスタイリング
    presetShadcn(), // shadcn/uiのサポート
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Noto Sans JP:400,500,700",
        serif: "Noto Serif JP:400,500,700",
      },
    }),
  ],
  shortcuts: {
    // よく使うユーティリティのショートカット
    "flex-center": "flex items-center justify-center",
    "grid-center": "grid place-items-center",
    "absolute-center":
      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  },
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
  },
});
