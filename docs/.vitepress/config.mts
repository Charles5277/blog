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
    // [
    //   'meta',
    //   { property: 'og:description', content: '' },
    // ],
    // ['meta', { property: 'og:image', content: '/og-image-rec.png' }],
    ['meta', { property: 'og:image:alt', content: '起司的開發技術分享 Blog' }],
    // ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1920' }],
    ['meta', { property: 'og:image:height', content: '1080' }],

    // ['meta', { property: 'og:image', content: '/og-image-squ.png' }],
    ['meta', { property: 'og:image:alt', content: '起司的開發技術分享 Blog' }],
    // ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1080' }],

    ['meta', { property: 'og:image:height', content: '1080' }],
    ['meta', { property: 'og:image:height', content: '1080' }],
    ['meta', { property: 'og:image:height', content: '1080' }],
    ['meta', { property: 'og:image:height', content: '1080' }],

    ['meta', { property: 'twitter:card', content: 'summary' }],
    ['meta', { property: 'twitter:site', content: 'summary' }],
    ['meta', { property: 'twitter:title', content: '起司的開發技術分享 Blog' }],
    [
      'meta',
      {
        property: 'twitter:description',
        content: '起司的開發技術分享Blog',
      },
    ],
    // ['meta', { property: 'twitter:image', content: '/og-image-squ.png' }],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
    // - Google Analytics
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=',
      },
    ],
    // - Google Tag Manager
    [
      'script',
      {},
      '(function(w,d,s,l,i){w[l]=w[l]||[];\nw[l].push({\'gtm.start\': new Date().getTime(),event:\'gtm.js\'});\nvar f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';\nj.async=true;\nj.src=\'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,\'script\',\'dataLayer\',\'GTM-\');',
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
