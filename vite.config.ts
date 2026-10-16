import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  server: { port: 3000, host: '127.0.0.1' },
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  build: {
    rollupOptions: {
      input: { main: path.resolve(__dirname, 'index.html'), preview: path.resolve(__dirname, 'preview.html') },
      output: { manualChunks: { editor: ['react-quill-new'], firebase: ['firebase/app', 'firebase/firestore'] } }
    }
  }
});
