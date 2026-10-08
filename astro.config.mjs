// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kavotech.uk',
  // `static/` keeps legacy asset URLs such as /public/kavologo.png (used by
  // transactional emails and existing social shares) stable.
  publicDir: './static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/review/') && !page.endsWith('/review') })],
  scopedStyleStrategy: 'class',
  devToolbar: { enabled: false },
});
