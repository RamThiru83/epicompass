import { defineConfig } from 'vitest/config';
import path from 'node:path';
export default defineConfig({
  resolve: { alias: { '@epicompass/epi-core': path.resolve(__dirname, '../../packages/epi-core/src/index.ts') } },
  test: { globals: true, include: ['src/**/*.test.ts'] },
});
