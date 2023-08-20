import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import vitePluginImp from "vite-plugin-imp";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // babel: {
      //   parserOpts: {
      //     plugins: ["decorators-legacy"],
      //   },
      // },
    }),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style(name) {
            // use less
            return `antd/es/${name}/style/index.js`;
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, ".", "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            "src/assets/style/base.less"
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});
