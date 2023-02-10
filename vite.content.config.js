import { defineConfig } from 'vite'
import { commonConfig } from './vite.config'
import { replaceCodePlugin } from 'vite-plugin-replace'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import { __DEV__, outputDir } from './const'
import hotReloadContent from './scripts/hot-reload/content-scripts.js'

export const r = (...args) => resolve(__dirname, '.', ...args)

// bundling the content script
export default defineConfig({
  ...commonConfig,
  build: {
    watch: __DEV__ ? {} : null,
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    outDir: r(`${outputDir}/content-scripts`),
    rollupOptions: {
      input: {
        contentScript: r('src/content-scripts/main.js'),
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: 'main.js',
        extend: true,
        format: 'iife'
      },
    },
  },
  plugins: [
    ...commonConfig.plugins,
    // replaceCodePlugin({
    //   replacements: [
    //     {
    //       from: /:root\{/g,
    //       to: ':host{'
    //     }
    //   ]
    // }),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
    hotReloadContent()
  ]
})
