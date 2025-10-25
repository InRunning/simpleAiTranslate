import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 多入口构建：popup/options HTML 页面 + background/content 脚本
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode !== 'production',
    target: 'chrome110',
    rollupOptions: {
      input: {
        popup: '/src/popup/index.html',
        options: '/src/options/index.html',
        background: '/src/background/index.ts',
        content: '/src/content/index.tsx'
      },
      output: {
        entryFileNames: (assetInfo) => {
          if (assetInfo.name === 'background') return 'background.js'
          if (assetInfo.name === 'content') return 'content.js'
          return '[name].js'
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
}))