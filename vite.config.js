import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 5173, // You can change this if needed
    open: true, // Automatically opens browser on dev start
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // Optional: auto import without full path
  },
});
