import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '起司的開發技術分享Blog',
  description: '前端開發學習心得與踩坑經驗',
  cleanUrls: true,
  base: '/dev-blog/', // 根據 repo 名稱設定
  head: [
    ['meta', { property: 'og:locale', content: 'zh_TW' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '起司的開發技術分享 Blog' }],
    [
      'meta',
      { property: 'og:description', content: '前端開發學習心得與踩坑經驗' },
    ],

    ['meta', { property: 'og:image', content: '/home.png' }],
    ['meta', { property: 'og:image:alt', content: 'logo' }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1080' }],
    ['meta', { property: 'og:image:height', content: '1080' }],

    ['meta', { property: 'twitter:card', content: 'summary' }],
    ['meta', { property: 'twitter:site', content: 'summary' }],
    ['meta', { property: 'twitter:title', content: '起司的開發技術分享 Blog' }],
    [
      'meta',
      {
        property: 'twitter:description',
        content: '前端開發學習心得與踩坑經驗',
      },
    ],
    ['meta', { property: 'twitter:image', content: '/home.png' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧀</text></svg>',
      },
    ],
    [
      'link',
      {
        rel:'shortcut icon',
        type:'image/x-icon',
        href:'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧀</text></svg>',
      }
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
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-HTW5MRZLKR');",
    ],
  ],
  appearance: 'dark',
  themeConfig: {
    siteTitle: 'Charles Dev Blog',
    logo: { src: '/logo.png', width: 24, height: 24 },
    nav: [

    ],
    sidebar: [
      {
        text: '文章主題',
        items: [
          { text: 'Vue.js', link: '/catalog/vue/' },
          { text: 'VS Code', link: '/catalog/vscode/' },
          { text: 'Git', link: '/catalog/git/' },
          { text: 'GitHub', link: '/catalog/github/' },
          { text: 'Docker', link: '/catalog/docker/' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/v6zDjzDh',
      },
      {
        icon: 'github',
        link: 'https://github.com/Charles5277',
      },
    ],
    footer: {
      message:
        'Released under the MIT License.',
      copyright:
        'Copyright © 2024-present Charles Yang',
    },

    search: {
      provider: 'local'
    }
  },
  markdown: {
    container: {
      infoLabel: ' ',
      tipLabel: ' ',
      warningLabel: ' ',
      dangerLabel: ' ',
      detailsLabel: '目錄',
    },
  },
});
