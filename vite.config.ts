import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        manifest: {
          id: '/',
          name: 'Alif Personal CashFlow',
          short_name: 'Alif CashFlow',
          description: 'Personal financial management app for tracking income, expenses, debts, and budgeting.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'https://cdn-icons-png.flaticon.com/512/2488/2488749.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'https://cdn-icons-png.flaticon.com/512/2488/2488749.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'https://cdn-icons-png.flaticon.com/512/2488/2488749.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
