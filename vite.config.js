import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
  },
  assetsInclude: ['**/*.svg'], // ✅ Treat SVGs as static assets
  resolve: {
    conditions: ['browser'], // ✅ Helps resolve browser-specific builds
  },
  build: {
    rollupOptions: {
      external: ['**/*.svg'], // ✅ Ensure SVGs aren't bundled as JS
    },
  },
});
