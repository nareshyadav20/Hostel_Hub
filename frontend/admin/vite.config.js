import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  css: {
    transformer: 'postcss'
  },

  server: {
    port: 5175,
    fs: {
      allow: ['..', '../../packages']
    }
  },

  resolve: {
    alias: {
      '@packages': path.resolve(__dirname, '../../packages'),
    }
  },

  build: {
    chunkSizeWarningLimit: 2000
  }
})