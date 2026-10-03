import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

const appDir = fileURLToPath(new URL('.', import.meta.url))
const sharedDir = fileURLToPath(new URL('../../shared/src', import.meta.url))

// H5 移动端：游戏逻辑来自 ../../shared，本工程只提供移动端外壳。
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  resolve: {
    alias: {
      '@shared': sharedDir,
      '@platform': fileURLToPath(new URL('./src/platform', import.meta.url)),
    },
    // shared 与外壳分处两个 node_modules 作用域，必须强制去重，
    // 否则 react / react-router-dom 会被打包两份（Context 不同，运行时必然出错）。
    dedupe: ['react', 'react-dom', 'react-router-dom', 'zustand'],
  },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
  server: {
    host: true,
    port: 5174,
    fs: { allow: [appDir, sharedDir] },
  },
  preview: {
    port: 4174,
  },
})
