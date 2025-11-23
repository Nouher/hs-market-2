import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // specific implementation to make process.env work in browser for your existing code
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
  }
});