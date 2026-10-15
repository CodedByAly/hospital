import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Set VITE_SITE_URL (e.g. https://www.yourdomain.com) when deploying so social
  // previews and structured data use absolute URLs. Without it, paths stay relative.
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'site-url',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    ],
    build: { target: 'es2020' },
  };
});
