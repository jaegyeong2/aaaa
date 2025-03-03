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
  server: {
    host: '0.0.0.0', // 외부 네트워크에서도 접근 가능하도록 설정
    port: 80, // 원하는 포트 설정
  },
  optimizeDeps: {
    include: ['browserify'] // 필요한 의존성을 명시적으로 추가
  }
})
