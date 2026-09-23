import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular()],
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