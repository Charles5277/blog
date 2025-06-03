---
title: 簡介 Nuxt 中的伺服器引擎：Nitro 與 H3
description: 快速了解 Nuxt 3 中的 Nitro 與 H3，如何讓後端開發更簡單高效，並支援多平台部署。
datePublished: 2025-06-04
category: Nuxt
tags:
  - Nuxt
  - Nitro
  - H3
  - UnJS
---

## Nitro：Nuxt 的通用伺服器引擎

Nitro 是 Nuxt 團隊打造的 Universal JS Server，負責處理 API routes、middleware、server plugins 與 SSR 渲染。其主要特點如下：

- **Universal JS server**：支援 SSR、static 等多種渲染模式
- **File-based routing**：自動將 `server/api`、`server/middleware` 轉為 HTTP Route
- **多平台部署**：支援 Netlify、Vercel、Cloudflare Workers 等多種平台
- **獨立打包**：將伺服器邏輯打包成單一檔案，部署不需額外程式碼
- **自動程式碼分割**：每個 API route/middleware 可獨立分割，提升效能
- **Storage Layer**：可存取靜態檔案系統、Database、Redis 等等
- **Caching System**：在 Storage Layer 之上提供快取機制

這些設計讓 Nuxt 能在不犧牲開發體驗下，輕鬆部署到各種現代雲端平台。

## H3：支撐 Nitro 的極簡 HTTP 核心

H3 是 Nitro 內部使用的極簡 HTTP 框架，專為現代全端與 Serverless 應用設計。其核心特點：

- **極簡、快速、可樹搖（tree-shakable）**：比 Express 更輕量、啟動更快
- **零額外依賴**：避免傳統框架的龐大依賴鏈
- **Composable 工具設計**：每個功能都是獨立工具函數，可按需引入，與 Vue 3 Composition API 風格一致
- **豐富內建工具**：如 `readBody`、`getQuery`、`setCookie` 等，直接用於 Nuxt 事件處理器

### 內建工具範例

```ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event); // 讀取請求主體
  const query = getQuery(event); // 取得查詢參數
  setCookie(event, 'session', 'abc123'); // 設定 Cookie
  return { body, query };
});
```

- **現代 JS 支援**：原生 async/await、ESM
- **Serverless / Edge Function 最佳化**：冷啟動極快，跨平台相容
- **完整 Node.js 支援**：可直接存取 `event.node.req`、`event.node.res` 等

## Nitro 與 H3 的關係

- **Nitro 是高階伺服器引擎，HTTP 處理完全建構於 H3 之上**
- **開發者在 `server/api`、middleware 中操作的 event 物件，即來自 H3**
- **Nuxt plugin (`defineNitroPlugin`) 會註冊到 H3 的 middleware stack**

### 範例：在 Nuxt 中自訂 API route 中的 H3 event

```ts
// server/api/hello.ts
export default defineEventHandler((event) => {
  const ua = event.node.req.headers['user-agent'];
  return { message: `Hello! You are using ${ua}` };
});
```

## 延伸閱讀

### UnJS 生態系

[🔗 UnJS](https://UnJS.io/) 是一組現代 JavaScript 工具包，專為 Universal JS 應用設計。包含上述提到的 Nitro、H3，以及 Nuxt 中常用的 $fetch 等。

### 官方文檔

[🔗 Server Engine | Nuxt Concepts](https://nuxt.com/docs/guide/concepts/server-engine)

## 結論

- **H3 是 Nitro 的基礎 HTTP 框架，極簡高效**
- **Nitro 將 H3 擴充為完整伺服器引擎，支援 SSR 與多平台部署**
- **UnJS 生態系提供現代 JS 應用的基礎建設，讓 Nuxt 更靈活高效**

這套架構讓 Nuxt 3 在伺服器端開發上，既能享受 Vue 3 的 Composition API 優勢，也因為 Nitro 與 H3 的模組化、靈活部署、自動分割、快取與 storage layer 等設計，讓專案在逐漸擴大或需要重構時，能大幅降低複雜度與開發門檻，並在部署上獲得極大的靈活性與效能提升。無論是 API 開發、SSR 還是 Serverless 應用，Nitro 與 H3 都提供了現代全端開發的最佳支援。

若希望自行設計中介層邏輯、存取資料層或自建 API 的開發者，理解 Nitro 與 H3 的運作方式將有助於更有效地控制伺服器行為與資源配置。
