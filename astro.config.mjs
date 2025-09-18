import { defineConfig } from 'astro/config';

// Prod'da GitHub Pages alt dizini, dev'de kök
const isProd = process.env.NODE_ENV === 'production';
const site = isProd
  ? 'https://yusufoztekin.github.io/yusufoztur'
  : 'http://localhost:4321';
const base = isProd ? '/yusufoztur' : '/';

export default defineConfig({
  output: 'static',
  site,
  base,
  server: { port: 4321 },
  vite: {
    server: { fs: { strict: false } },
  },
});
