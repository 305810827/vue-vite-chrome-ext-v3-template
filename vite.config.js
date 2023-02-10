import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import { chromeExtension } from "vite-plugin-chrome-extension";
import ViteComponents from "vite-plugin-components";
import hotReloadBackground from './scripts/hot-reload/background.js'
import { __DEV__, outputDir } from './const'
import ViteIcons, { ViteIconsResolver } from "vite-plugin-icons";

export const r = (...args) => resolve(__dirname, '.', ...args)

export const commonConfig = {
    root: r('src'),
    define: {
        __DEV__,
    },
    resolve: {
        alias: {
            "@": `${r('src')}/`,
            '~/': `${r('src')}/`,
        }
    },
    plugins: [
        vue(),
        ViteComponents({
            extensions: ["vue"],
            // auto import icons
            customComponentResolvers: [
                // https://github.com/antfu/vite-plugin-icons
                ViteIconsResolver({
                    componentPrefix: ""
                    // enabledCollections: ['carbon']
                })
            ]
        }),
        ViteIcons(),
        // chromeExtension(),
    ],
}


// https://vitejs.dev/config/
export default defineConfig({
    ...commonConfig,
    build: {
        watch: __DEV__ ? {} : null,
        cssCodeSplit: false,
        emptyOutDir: false,
        sourcemap: false,
        outDir: r(outputDir),
        rollupOptions: {
            input: {
                background: r('src/background/main.js'),
                popup: r('src/popup/main.js'),
                options: r('src/options/main.js'),
            },
            output: {
                assetFileNames: '[name].[ext]',
                entryFileNames: '[name]/main.js',
                extend: true,
                format: 'es',
            },
        },
    },
    plugins: [
        ...commonConfig.plugins,
        hotReloadBackground()
    ]
});
