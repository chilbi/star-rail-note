import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qrcode } from 'vite-plugin-qrcode';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/star-rail-note/',
  plugins: [
    react(),
    qrcode()
  ]
});
