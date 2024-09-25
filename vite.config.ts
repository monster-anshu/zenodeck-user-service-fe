import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const env = loadEnv('', process.cwd(), '');

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      '/api/v1': {
        target: env.API_URI,
        changeOrigin: true,
      },
    },
  },
});
