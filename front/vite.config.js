import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},  // process.env 초기화
    crypto: 'crypto-browserify',  // crypto-browserify로 설정
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',  // crypto-browserify로 대체
    },
  },
})
