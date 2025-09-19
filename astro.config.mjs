import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const isNetlify = process.env.NETLIFY === 'true' || process.env.DEPLOY_TARGET === 'netlify';
const site = isNetlify ? (process.env.URL || 'http://localhost:4321') : 'https://yusufozkan727.github.io/yusufoztur';
const base = isNetlify ? '/' : '/yusufoztur';

export default defineConfig({
  output: 'static',
  site,
  base,
  integrations: [sitemap()],
  server: { port: 4321 },
  vite: {
    server: { fs: { strict: false } },
  },
});

