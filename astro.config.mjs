import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import UnoCSS from "@unocss/astro";
import Icons from "unplugin-icons/vite";
import { fileURLToPath } from "url";

// https://astro.build/config
export default defineConfig({
  site: "https://gu-art-photo-club.github.io",
  base: "/",
  integrations: [
    react(),
    UnoCSS({
      // UnoCSSの設定
      injectReset: true,
    }),
  ],
  vite: {
    plugins: [
      Icons({
        compiler: "jsx",
        jsx: "react",
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
  // 画像設定を削除または変更
  // image: {
  //   service: {
  //     entrypoint: "astro/assets/services/sharp",
  //   },
  //   format: ["webp"],
  // },
  output: "static",
  build: {
    format: "file",
  },
});
