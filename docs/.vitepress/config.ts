import type { DefaultTheme } from 'vitepress';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';

import { handleHeadMeta } from './utils/handleHeadMeta';

import sidebar from './utils/sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-TW',
  title: 'Charles 起司的軟體開發技術分享Blog',
  description: '前端開發學習心得與踩坑經驗',
  cleanUrls: true,
  base: '/', // 根據 repo 名稱設定
  appearance: 'dark',
  head: [
    ['meta', { property: 'og:locale', content: 'zh_TW' }],
    ['meta', { property: 'og:type', content: 'website' }],
    // ['meta', { property: 'og:title', content: 'Charles 起司的軟體開發技術分享 Blog' }],
    // [
    //   'meta',
    //   { property: 'og:description', content: '前端開發學習心得與踩坑經驗' },
    // ],

    ['meta', { property: 'og:image', content: 'home-512.webp' }],
    ['meta', { property: 'og:image:alt', content: 'logo' }],
    ['meta', { property: 'og:image:type', content: 'image/webp' }],

    // ['meta', { property: 'twitter:card', content: 'summary' }],
    // ['meta', { property: 'twitter:site', content: 'summary' }],
    // ['meta', { property: 'twitter:title', content: 'Charles 起司的軟體開發技術分享 Blog' }],
    // [
    //   'meta',
    //   {
    //     property: 'twitter:description',
    //     content: '前端開發學習心得與踩坑經驗',
    //   },
    // ],
    ['meta', { property: 'twitter:image', content: 'home-512.webp' }],

    // 行動裝置 LCP 優化
    ['link', { rel: 'preload', as: 'image', href: '/home-mobile.webp', media: '(max-width: 480px)', fetchpriority: 'high' }],
    ['link', { rel: 'preload', as: 'image', href: '/home-384.webp', media: '(min-width: 481px) and (max-width: 768px)', fetchpriority: 'high' }],
    ['link', { rel: 'preload', as: 'image', href: '/home-512.webp', media: '(min-width: 769px)', fetchpriority: 'high' }],

    // DNS 預取和連線優化
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],

    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
    [
      'link',
      {
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],

    // - vuestic
    [
      'link',
      {
        href: `
      https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;1,700&display=swap
    `,
        rel: 'stylesheet',
      },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        rel: 'stylesheet',
      },
    ],
    // - Google Analytics
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-HTW5MRZLKR',
      },
    ],
    // - Google Tag Manager
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];\n
      function gtag(){dataLayer.push(arguments);}\n
      gtag(\'js\', new Date());\n
      gtag(\'config\', \'G-HTW5MRZLKR\');`,
    ],

    // - Google AdSense
    [
      'script',
      {
        async: '',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2836544901703817',
        crossorigin: 'anonymous',
      },
    ],

    // Image preloading for LCP optimization
    ['link', { rel: 'preload', as: 'image', href: '/home-512.webp', fetchpriority: 'high' }],
    ['link', { rel: 'preload', as: 'image', href: '/home-384.webp', media: '(max-width: 480px)' }],
    ['link', { rel: 'preload', as: 'image', href: '/home-256.webp', media: '(max-width: 320px)' }],
  ],
  themeConfig: {
    siteTitle: 'Charles Dev Blog',
    logo: { src: '/logo.png', width: 24, height: 24 },
    lastUpdated: {
      text: '更新時間',
      formatOptions: {
        formatMatcher: 'best fit',
        dateStyle: 'long',
        timeStyle: 'short',
        hourCycle: 'h23',
        forceLocale: true,
      },
    },
    editLink: {
      pattern: 'https://github.com/Charles5277/blog/tree/main/docs/:path',
      text: '在 GitHub 編輯此頁',
    },
    nav: [],
    sidebar: [
      {
        text: '文章分類',
        items: [{ base: '/', items: sidebarPost() }],
      },
    ],
    socialLinks: [
      {
        icon: 'instagram',
        link: 'https://www.instagram.com/charlestw.dev/',
        ariaLabel: 'instagram link',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 439.999 511.429"><path fill-rule="nonzero" d="M342.382 237.037a175.843 175.843 0 00-6.707-3.045c-3.947-72.737-43.692-114.379-110.428-114.805-38.505-.256-72.972 15.445-94.454 48.041l36.702 25.178c15.265-23.159 39.221-28.097 56.864-28.097.203 0 .408 0 .61.003 21.973.139 38.555 6.528 49.287 18.987 7.81 9.071 13.034 21.606 15.62 37.425-19.482-3.312-40.552-4.329-63.077-3.039-63.449 3.656-104.24 40.661-101.5 92.081 1.39 26.083 14.384 48.522 36.586 63.18 18.773 12.391 42.95 18.451 68.078 17.08 33.183-1.819 59.214-14.48 77.376-37.631 13.793-17.579 22.516-40.362 26.368-69.068 15.814 9.543 27.535 22.103 34.007 37.2 11.007 25.665 11.648 67.84-22.764 102.222-30.15 30.121-66.392 43.151-121.164 43.554-60.757-.45-106.707-19.934-136.582-57.914-27.976-35.563-42.434-86.93-42.973-152.675.539-65.745 14.997-117.113 42.973-152.675 29.875-37.979 75.824-57.464 136.581-57.914 61.197.455 107.948 20.033 138.967 58.195 15.21 18.713 26.677 42.248 34.236 69.688l43.011-11.476c-9.163-33.775-23.581-62.881-43.203-87.017C357.031 25.59 298.872.519 223.935 0h-.3C148.851.518 91.343 25.683 52.709 74.794 18.331 118.498.598 179.308.002 255.534l-.002.18.002.18c.596 76.226 18.329 137.037 52.707 180.741 38.634 49.11 96.142 74.277 170.926 74.794h.3c66.487-.462 113.352-17.868 151.96-56.442 50.511-50.463 48.991-113.717 32.342-152.548-11.944-27.847-34.716-50.464-65.855-65.402zm-114.795 107.93c-27.809 1.566-56.7-10.917-58.124-37.652-1.056-19.823 14.108-41.942 59.83-44.577 5.237-.302 10.375-.45 15.422-.45 16.609 0 32.146 1.613 46.272 4.702-5.268 65.798-36.173 76.483-63.4 77.977z"/></svg>',
        },
        link: 'https://www.threads.net/@charlestw.dev',
        ariaLabel: 'threads link',
      },
      {
        icon: 'github',
        link: 'https://github.com/Charles5277',
        ariaLabel: 'github link',
      },
    ],
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Charles Yang',
    },

    search: {
      provider: 'local',
    },
  },
  markdown: {
    container: {
      infoLabel: ' ',
      tipLabel: ' ',
      warningLabel: ' ',
      dangerLabel: ' ',
      detailsLabel: '',
    },
  },

  rewrites: {
    'post/(.*)': '(.*)',
  },

  sitemap: {
    hostname: 'https://blog.charlestw.dev/',
    transformItems(items) {
      items = items.filter((item) => {
        if (item.url.includes('catalog/') && item.url !== 'catalog/') {
          return true;
        }
        return true;
      });

      return items;
    },
  },

  async transformHead(content) {
    return handleHeadMeta(content);
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

function sidebarPost(): DefaultTheme.SidebarItem[] {
  return sidebar;
}
