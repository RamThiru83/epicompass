import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@epicompass/epi-core': path.resolve(__dirname, '../../packages/epi-core/src/index.ts') } },
  server: { port: 5173 },
});
