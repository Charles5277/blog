---
title: Nuxt 引入使用靜態資源的方式
description: 透過 Nitro 輕鬆將 json 檔、圖片、影片等靜態資源導入 Nuxt 專案，並了解 public assets 與 server assets 的差異與使用方式。
datePublished: 2025-06-04
category: Nuxt
tags:
  - Nuxt
  - Nitro
---

在純 SPA 的 Vue 專案中，我們常透過 `import data from './data.json'` 讀取 JSON。但在 Nuxt 中，因預設使用 Nitro，前後端環境分離，靜態資源分為「公開資源 (public assets)」與「伺服器資源 (server assets)」，因此無法直接 `import`。本文將說明其原因，並示範如何正確讀取 JSON、圖片等靜態資源。

## 為什麼不能直接 import 靜態檔案？

在 Nuxt 專案中，`import` 靜態檔案會報錯的主要原因在於 Nuxt 採用了 SSR (伺服器端渲染) 與 Nitro 作為執行引擎，並且嚴格區分執行環境與靜態資源的型態。

- `import` 是 ES Module 的靜態語法，會在建構 (build-time) 或 SSR 階段執行，僅適用於被當作模組處理的檔案。
- `public/` 資料夾內的內容並非模組，而是部署後透過 URL 存取的公開靜態資源。
- 因此，若嘗試 `import '~/public/data.json'`，會在建構時找不到對應模組而出錯。

若你只用過 Vue 開發過純 SPA 專案，這樣的錯誤可能令人疑惑。其實，在純前端專案中，Vite 會將 `.json` 視為模組處理。但在 Nuxt 中，這類靜態資源應透過 HTTP API 或 `/public` 的 URL 存取方式處理，而不是直接 `import`。

---

## Public assets (公開靜態資源)

在 Nuxt 中，`public/` 資料夾用來存放靜態資源 (如圖片、影片、robots.txt 等)。這些檔案會自動對外公開，無需額外設定。

- 放在 `public/` 的檔案，會自動對應到網站根目錄。
- 例如：`public/image.png` 可直接透過 `localhost:3000/image.png` 存取。

### 目錄結構範例

```
public/
├── image.png     <-- localhost:3000/image.png
├── video.mp4     <-- localhost:3000/video.mp4
└── robots.txt    <-- localhost:3000/robots.txt
```

### 如何使用 public assets

1. **將靜態檔案放入 `public/`**
2. **重新啟動開發伺服器**
3. **直接在瀏覽器或 vue 檔中以 `<template>` 或 `<script setup>`存取**

```vue
<script setup>
  import image from '~/public/image.png';
</script>

<template>
  <img :src="image" alt="My Image" />
</template>
```

```vue
<template>
  <div>
    <img src="/image.png" alt="My Image" />
    <video src="/video.mp4" controls></video>
  </div>
</template>
```

#### 部署時的處理

- Nitro 會自動將 `public/` 內容複製到 `.output/public/`，並建立資源清單，提升效能與快取。
- 不需手動搬移或設定，部署後即可直接存取。

#### 常見問題

**Q：需要設定前綴路由或 middleware 嗎？**

> **Ans**：不需要，Nitro 會自動處理。

## Server assets (伺服器資源)

`server/assets/` 目錄用於存放僅供伺服器端存取的檔案 (如 json、機密檔案等)，這些資源不會直接公開給用戶端。

- 放在 `server/assets/` 的檔案會被打包進伺服器 bundle，可透過 Nitro 的 storage API 於 handler 內讀取。
- 適合存放 API 需要的資料

### 目錄結構範例

```
.
├── server/
│   └── assets/
│       ├── data.json      // 僅伺服器端可存取
│   └── template/
│       └── success.html   // 僅伺服器端可存取
└── public/
  ├── image.png     <-- localhost:3000/image.png
  ├── video.mp4     <-- localhost:3000/video.mp4
  └── robots.txt    <-- localhost:3000/robots.txt
```

### 如何使用 server assets

1. **將檔案放入 `server/assets/`**
2. **在 API handler 內用 `useStorage('assets:server')` 讀取**

- server/api/data.ts

```ts
export default defineEventHandler(async () => {
  const data = await useStorage('assets:server').getItem('data.json');
  return data;
});
```

- pages/index.vue

```vue
<script setup>
  const { data } = await useFetch('/api/data');
</script>
<template>
  <div>
    <h1>Server Data</h1>
    <pre>{{ data }}</pre>
  </div>
</template>
```

#### 自訂 server assets 目錄

可在 `nuxt.config.ts` 設定自訂目錄：

```ts
export default defineNuxtConfig({
  nitro: {
    serverAssets: [
      {
        baseName: 'templates',
        dir: './templates', // 存放在 /server/templates 中
      },
    ],
  },
});
```

然後在 handler 內用 `useStorage('assets:templates')` 讀取：

```ts
const html = await useStorage('assets:templates').getItem('success.html');
```

---

## 延伸閱讀

- [Nitro 官方文件：Assets](https://nitro.build/guide/assets)
- [Nuxt 官方文件：Static Assets](https://nuxt.com/docs/guide/directory-structure/assets)
- [Vite 功能：直接 Import JSON](https://vite.dev/guide/features#json)
