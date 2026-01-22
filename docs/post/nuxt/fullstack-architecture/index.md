---
title: Nuxt 4 全棧專案架構設計
description: 從技術選型到目錄結構，打造可維護的 Nuxt 4 + Supabase + Cloudflare Workers 全棧應用。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - TypeScript
  - Architecture
---

# Nuxt 4 全棧專案架構設計

> 系列文章：Nuxt 4 全棧實戰（1/12）

## 這篇要解決什麼問題

當專案規模成長，架構設計的好壞直接影響開發效率與維護成本。這篇文章將說明：

- 為什麼選擇 Nuxt 4 + Supabase + Cloudflare Workers
- app/ vs server/ 的分層設計
- 選擇 SPA 模式（ssr: false）的場景與權衡
- 模組化的目錄結構設計

---

## 技術棧選型

### 核心技術

| 層級 | 技術 | 選擇理由 |
|------|------|----------|
| **框架** | Nuxt 4 | Vue 3 生態系最成熟的全棧框架 |
| **UI** | Nuxt UI 4 | 官方 UI 庫，Dashboard 元件完整 |
| **資料庫** | Supabase | PostgreSQL + 即時訂閱 + Auth + Storage |
| **部署** | Cloudflare Workers | Edge Runtime，全球低延遲 |
| **狀態管理** | Pinia + Pinia Colada | 輕量 + 內建非同步狀態管理 |

### 為什麼選 Nuxt 4

1. **檔案式路由**：pages/ 目錄自動產生路由
2. **自動匯入**：composables、components、utils 自動可用
3. **Server API**：server/api/ 直接寫 API，無需額外設定
4. **TypeScript 優先**：內建類型支援，開發體驗優秀

### 為什麼選 Supabase

1. **PostgreSQL**：成熟的關聯式資料庫，支援複雜查詢
2. **RLS**：Row Level Security 在資料庫層保護資料
3. **TypeScript 類型**：CLI 自動產生完整類型定義
4. **本地開發**：Docker 一鍵啟動，不依賴雲端

---

## nuxt.config.ts 核心設定

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,  // SPA 模式

  modules: [
    '@nuxt/ui',
    '@nuxt/test-utils/module',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@sentry/nuxt/module',
    '@onmax/nuxt-better-auth',
    '@pinia/colada-nuxt',
    'nuxt-charts',
  ],

  // 元件目錄配置：移除路徑前綴
  components: [
    {
      path: '~/components',
      pathPrefix: false,  // MachineTable.vue → <MachineTable />
    },
  ],

  // Nitro 配置：部署到 Cloudflare Workers
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
})
```

### 關於 ssr: false

選擇 SPA 模式的場景：

- **Dashboard 應用**：需要登入才能使用，SEO 不重要
- **企業內部系統**：使用者固定，不需要搜尋引擎索引
- **降低複雜度**：不需處理 hydration mismatch

如果你的應用需要 SEO（如部落格、電商），請保持 `ssr: true`。

---

## 目錄結構設計

```
project/
├── app/                        # Client-side 程式碼
│   ├── app.vue                 # 根元件
│   ├── app.config.ts           # UI 主題設定
│   ├── layouts/                # 版面配置
│   │   └── default.vue         # Dashboard 版面
│   ├── pages/                  # 檔案式路由
│   ├── components/             # Vue 元件（按功能分類）
│   │   └── common/             # 共用元件
│   ├── composables/            # Vue composables
│   ├── stores/                 # Pinia stores
│   ├── queries/                # Pinia Colada queries
│   ├── types/                  # TypeScript 類型
│   │   └── database.types.ts   # Supabase 自動產生
│   └── assets/
│       └── css/main.css        # 全域樣式
│
├── server/                     # Server-side 程式碼
│   ├── api/                    # API 端點
│   │   ├── v1/                 # 版本化業務 API
│   │   ├── auth/               # 認證相關
│   │   └── admin/              # 管理員專用
│   ├── middleware/             # Server middleware
│   ├── utils/                  # Server 工具函式
│   │   └── supabase.ts         # Supabase client
│   └── auth.config.ts          # Better Auth 設定
│
├── shared/                     # 前後端共用
│   └── types/                  # 共用類型定義
│
├── test/                       # 測試檔案
│   ├── unit/                   # 單元測試
│   └── nuxt/                   # Nuxt 環境測試
│
├── supabase/                   # Supabase 設定
│   └── migrations/             # 資料庫 migration
│
├── docs/                       # 專案文件
│   └── verify/                 # 狀態文件（非歷史紀錄）
│
└── .claude/                    # AI 輔助開發
    └── skills/                 # AI Skills 定義
```

### 為什麼這樣分層

**app/ vs server/ 分離的好處：**

1. **關注點分離**：前端邏輯與後端邏輯清楚區分
2. **安全性**：敏感邏輯只在 server/ 執行
3. **可測試性**：各層可以獨立測試

**shared/ 的用途：**

- 放置前後端共用的類型定義
- Zod schema 可以在 client 驗證表單，也在 server 驗證請求

---

## 踩坑經驗

### 目錄結構混亂的代價

早期專案沒有規劃好結構，導致：

- 元件散落各處，難以找到
- API 命名不一致（有的 `/api/users`，有的 `/api/v1/user`）
- 類型定義重複，維護困難

**解決方案**：建立明確的目錄結構規範，並在 CLAUDE.md 中記錄。

### pathPrefix: false 的影響

預設情況下，Nuxt 會根據目錄結構產生元件名稱：

```
components/
└── machines/
    └── MachineTable.vue  → <MachinesMachineTable />
```

設定 `pathPrefix: false` 後：

```
components/
└── machines/
    └── MachineTable.vue  → <MachineTable />
```

**注意**：這樣做需要確保元件名稱在整個專案中唯一。

---

## 常用 Scripts

```json
{
  "scripts": {
    "dev": "nuxt dev --dotenv .env -o",
    "build": "nuxt build",
    "check": "pnpm format && pnpm lint && pnpm typecheck && pnpm test",
    "typecheck": "nuxt typecheck",
    "test": "vitest run --coverage",
    "db:reset": "supabase db reset",
    "db:lint": "supabase db lint --level warning",
    "db:types": "supabase gen types --lang=typescript --local | tee app/types/database.types.ts > /dev/null"
  }
}
```

### pnpm check 一條龍

```bash
pnpm check
# 等同於執行：
# 1. pnpm format    - 程式碼格式化
# 2. pnpm lint      - 程式碼檢查
# 3. pnpm typecheck - 類型檢查
# 4. pnpm test      - 執行測試
```

---

## 最佳實踐總結

1. **技術選型要配合需求**：Dashboard 選 SPA，公開網站選 SSR
2. **目錄結構要提前規劃**：app/ 放 client，server/ 放 API
3. **共用邏輯放 shared/**：類型、Zod schema 前後端共用
4. **文件即規範**：在 CLAUDE.md 或 docs/ 記錄架構決策

---

## 延伸閱讀

- [Nuxt 4 官方文件](https://nuxt.com/docs)
- [Supabase 文件](https://supabase.com/docs)
- 下一篇：[Nuxt UI Dashboard 實戰](/nuxt/nuxt-ui-dashboard/)
