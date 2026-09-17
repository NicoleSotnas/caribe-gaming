import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: 'src/test.ts',
    server: {
      deps: {
        inline: [
          '@angular/core',
          '@angular/common',
          '@angular/platform-browser',
          '@angular/platform-browser-dynamic',
          '@angular/router',
          '@angular/forms',
        ],
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        all: true,
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.spec.ts'],
      },
    },
  },
});
