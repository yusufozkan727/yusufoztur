import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://yusufoztekin.github.io/yusufoztur',
  base: '/yusufoztur',
  server: { port: 4321 },
  vite: {
    server: { fs: { strict: false } },
  },
});
