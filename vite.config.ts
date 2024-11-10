import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'boostlearn.test',
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'esnext', // Cible ESNext pour inclure le support de top-level await
  },
  build: {
    target: 'esnext', // Cible de compilation pour ESNext
  },
})
