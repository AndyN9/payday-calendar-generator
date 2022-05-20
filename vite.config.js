/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
  test: {
    exclude: [...configDefaults.exclude, '**/e2e/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
