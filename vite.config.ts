import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: true
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 5000,
  },
});