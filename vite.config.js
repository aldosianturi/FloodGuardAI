import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        map: resolve(__dirname, 'map.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        laporan: resolve(__dirname, 'laporan.html')
      }
    }
  }
});