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
    target: 'es2022', // Cible ES2022 pour plus de compatibilité
  },
  build: {
    target: 'es2022', // Cible de compilation pour ES2022
  },
})
