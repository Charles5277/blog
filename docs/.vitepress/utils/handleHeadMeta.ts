import { type HeadConfig, type TransformContext } from "vitepress";

// - 處理每個頁面 meta 資訊
export function handleHeadMeta(context: TransformContext) {
  const { description, title, relativePath } = context.pageData;
  // - 增加 Twitter Card 資訊
  const ogUrl: HeadConfig = ["meta", { property: "og:url", content: addBase(relativePath.slice(0, -3)) + '.html' }]
  const ogTitle: HeadConfig = ["meta", { property: "og:title", content: `${title} | Charles 起司的開發技術分享Blog` }]
  const ogDescription: HeadConfig = ["meta", { property: "og:description", content: description || context.description }]
  const ogImage: HeadConfig = ["meta", { property: "og:image", content: "https://blog.charlestw.dev/home.webp" }]
  const twitterCard: HeadConfig = ["meta", { name: "twitter:card", content: "summary" }]
  const twitterImage: HeadConfig = ["meta", { name: "twitter:image:src", content: "https://blog.charlestw.dev/home.webp" }]
  const twitterDescription: HeadConfig = ["meta", { name: "twitter:description", content: description || context.description }]

  const twitterHead: HeadConfig[] = [
    ogUrl, ogTitle, ogDescription, ogImage,
    twitterCard, twitterDescription, twitterImage,
  ]

  return twitterHead
}

export function addBase(relativePath: string) {
  const host = 'https://charlestw.dev'
  if (relativePath.startsWith('/')) {
    return host + relativePath
  } else {
    return host + '/' + relativePath
  }
}
