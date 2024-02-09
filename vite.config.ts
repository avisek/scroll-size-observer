import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'

const rootDir = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(rootDir, './src')
const distDir = resolve(rootDir, './dist')

// https://vitejs.dev/config/
export default defineConfig({
  base: '/scroll-size-observer/',
  root: srcDir,
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 4000,
  },
  build: {
    lib: {
      entry: {
        main: resolve(srcDir, './index.html'),
        ScrollSizeObserver: resolve(srcDir, './ScrollSizeObserver.ts'),
      },
      formats: ['es'],
    },
    outDir: distDir,
    emptyOutDir: true,
  },
  plugins: [dts({ exclude: resolve(srcDir, './main.ts') })],
})
