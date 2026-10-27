import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import https from 'node:https';

// Cria um agente HTTPS que aceita o handshake TLS sem fechar o socket
const agent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
});

const STEAM_TARGET = 'https://store.steampowered.com';

export default defineConfig({
  plugins: [angular()],
  server: {
    proxy: {
      '/api': {
        target: STEAM_TARGET,
        changeOrigin: true,
        secure: false,
        agent: agent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
      },
      '/appreviews': {
        target: STEAM_TARGET,
        changeOrigin: true,
        secure: false,
        agent: agent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: 'src/test.ts',
    server: {
      deps: {
        inline: ['rxfire', '@angular/fire'],
      },
    },
  },
});