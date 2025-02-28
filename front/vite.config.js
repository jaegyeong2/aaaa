import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    crypto: 'crypto-browserify',  // crypto 폴리필 설정
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',  // crypto-browserify 모듈로 대체
    },
  },
})
