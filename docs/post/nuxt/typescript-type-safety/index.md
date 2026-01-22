---
title: TypeScript 類型安全實戰
description: 在 Nuxt 4 專案中實現端到端類型安全，從 Supabase 自動產生類型到 Vue 元件的嚴格類型定義。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - TypeScript
  - Architecture
series: nuxt-fullstack
seriesTitle: Nuxt 4 全棧實戰
seriesOrder: 3
---

# TypeScript 類型安全實戰

## 這篇要解決什麼問題

TypeScript 的威力在於**編譯時期就能發現錯誤**。但要發揮這個優勢，需要：

- 資料庫類型與程式碼同步
- Vue 元件的 Props/Emits 嚴格類型
- 處理 null/undefined 的優雅方式
- Client 與 Server 共享類型

---

## 端到端類型安全的架構

```
┌─────────────────────────────────────────────────────────┐
│                    Type Sources                         │
├─────────────────────────────────────────────────────────┤
│  Supabase Migration ──→ database.types.ts (自動產生)    │
│  shared/types/      ──→ 全域共用類型                    │
│  app/types/         ──→ Client 專用類型                 │
│  server/types/      ──→ Server 專用類型                 │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│                    Type Consumers                       │
├─────────────────────────────────────────────────────────┤
│  Vue Components     ←── Props, Emits, defineModel       │
│  Composables        ←── 回傳值類型                       │
│  Server API         ←── 請求/回應類型                    │
│  Pinia Stores       ←── State 類型                      │
└─────────────────────────────────────────────────────────┘
```

---

## Supabase 類型自動產生

### 為什麼自動產生？

手動維護資料庫類型有三大問題：

1. **同步困難**：Migration 修改後忘記更新類型
2. **人為錯誤**：欄位名稱打錯、類型不對
3. **維護成本**：每次改表都要手動修改

### 自動產生 database.types.ts

```bash
# 從本地 Supabase 產生類型
supabase gen types typescript --local | tee app/types/database.types.ts > /dev/null
```

產生的檔案結構：

```typescript
// app/types/database.types.ts（自動產生，勿手動編輯）
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
        }
      }
    }
    Views: Record&lt;string, never&gt;
    Functions: Record&lt;string, never&gt;
    Enums: {
      user_role: 'admin' | 'manager' | 'staff'
    }
  }
}
```

### 使用自動產生的類型

```typescript
import type { Database } from '~/types/database.types'

// Client 端：使用泛型傳入 Database 類型
const client = useSupabaseClient&lt;Database&gt;()

const { data } = await client
  .schema('public')
  .from('users')
  .select('id, name, email')
// data 的類型：{ id: string; name: string | null; email: string }[] | null

// 提取單表類型
type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserRole = Database['public']['Enums']['user_role']
```

### Server 端使用類型

```typescript
// server/utils/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/app/types/database.types'

let serviceClient: SupabaseClient&lt;Database&gt; | null = null

export function getServerSupabaseClient(): SupabaseClient&lt;Database&gt; {
  if (serviceClient) return serviceClient

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !serviceKey) {
    throw createError({
      statusCode: 500,
      message: '伺服器設定錯誤：缺少 Supabase 環境變數',
    })
  }

  serviceClient = createClient&lt;Database&gt;(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return serviceClient
}
```

---

## Vue 元件類型定義

### Props 最佳實踐

```vue
&lt;script setup lang="ts"&gt; // ✅ 推薦：使用 interface 定義 Props interface
Props { userId: string showAvatar?: boolean role: 'admin' | 'manager' | 'staff'
} // 不需要 const props =，除非在 script 中使用 defineProps&lt;Props&gt;() //
如果需要在 script 中使用 props const props = defineProps&lt;Props&gt;()
console.log(props.userId) &lt;/script&gt;
```

### Props 解構與預設值

```vue
&lt;script setup lang="ts"&gt; interface Props { title: string count?: number
items?: string[] } // Vue 3.5+ 可以直接解構並設定預設值 const { title, count =
0, items = [] } = defineProps&lt;Props&gt;() &lt;/script&gt;
```

### Emits 類型定義

```vue
&lt;script setup lang="ts"&gt; // ✅ 推薦：使用元組語法定義參數 const emit =
defineEmits&lt;{ update: [value: string] delete: [id: string, reason?: string]
close: [] // 無參數事件 }&gt;() // 使用時有完整類型檢查 emit('update', 'new
value') // ✅ emit('update', 123) // ❌ 類型錯誤 emit('delete', 'id-123') // ✅
emit('close') // ✅ &lt;/script&gt;
```

### defineModel 雙向綁定

```vue
&lt;script setup lang="ts"&gt; // 基本用法 const modelValue =
defineModel&lt;string&gt;() // 具名 v-model const firstName =
defineModel&lt;string&gt;('firstName') const lastName =
defineModel&lt;string&gt;('lastName') // 帶預設值 const count =
defineModel&lt;number&gt;('count', { default: 0 }) &lt;/script&gt; &lt;!--
父元件使用 --&gt; &lt;UserForm v-model:first-name="user.firstName"
v-model:last-name="user.lastName" /&gt;
```

---

## 全域類型定義

### shared/types 目錄結構

```
shared/
└── types/
    └── index.d.ts    # 全域類型宣告
```

### Maybe 類型處理 null/undefined

```typescript
// shared/types/index.d.ts
declare global {
  /**
   * 表示可能為 null 或 undefined 的值
   * 常用於 API 回應或可選欄位
   */
  type Maybe&lt;T&gt; = T | null | undefined
}

export {}  // 確保這是一個模組
```

### 使用 Maybe 類型

```typescript
// 處理可能為空的資料
function processUser(user: Maybe&lt;User&gt;): string | null {
  if (!user) return null
  return user.name
}

// API 回應類型
interface ApiResponse&lt;T&gt; {
  data: Maybe&lt;T&gt;
  error: Maybe&lt;string&gt;
}

// 搭配 Optional Chaining
const userName = user?.name ?? '未知使用者'
```

---

## Server API 類型定義

### 請求驗證與類型

```typescript
// server/api/v1/users/index.post.ts
import { z } from 'zod'

// 定義請求 Schema（同時是類型和驗證器）
const createUserSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  name: z.string().min(2, '名稱至少 2 個字元'),
  role: z.enum(['admin', 'manager', 'staff']),
})

// 從 Schema 推導類型
type CreateUserRequest = z.infer&lt;typeof createUserSchema&gt;

export default defineEventHandler(async (event) =&gt; {
  const body = await readBody(event)

  // 驗證並取得類型安全的資料
  const validated = createUserSchema.parse(body)
  // validated 的類型：{ email: string; name: string; role: 'admin' | 'manager' | 'staff' }

  // ... 處理邏輯
})
```

### 回應類型定義

```typescript
// server/types/api.d.ts
export interface PaginatedResponse&lt;T&gt; {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface SingleResponse&lt;T&gt; {
  data: T
}

// 使用範例
export default defineEventHandler(async (event): Promise&lt;PaginatedResponse&lt;User&gt;&gt; =&gt; {
  // ... 查詢邏輯
  return {
    data: users,
    pagination: { page: 1, pageSize: 10, total: 100, totalPages: 10 },
  }
})
```

---

## 踩坑經驗

### 類型不一致的 Runtime Error

**問題**：TypeScript 編譯通過，但執行時出現 undefined 錯誤。

**原因**：類型定義與實際資料不符。

```typescript
// ❌ 錯誤：假設所有欄位都存在
interface User {
  id: string;
  name: string; // 實際上資料庫允許 null
  email: string;
}

// API 回傳 { id: '1', name: null, email: 'test@example.com' }
const user = await fetchUser();
console.log(user.name.toUpperCase()); // Runtime Error: Cannot read property 'toUpperCase' of null
```

**解決**：類型定義要反映真實資料結構。

```typescript
// ✅ 正確：使用自動產生的類型或明確標記 nullable
interface User {
  id: string;
  name: string | null; // 明確標記可為 null
  email: string;
}

// 使用時檢查
const displayName = user.name ?? "未設定名稱";
```

### Supabase 查詢類型遺失

**問題**：忘記傳入 Database 泛型，導致查詢結果無類型。

```typescript
// ❌ 錯誤：無類型提示
const client = useSupabaseClient()
const { data } = await client.from('users').select('*')
// data 的類型：any

// ✅ 正確：傳入 Database 泛型
const client = useSupabaseClient&lt;Database&gt;()
const { data } = await client.from('users').select('*')
// data 的類型：完整的 User 類型
```

### Migration 後忘記更新類型

**問題**：新增欄位後，TypeScript 沒有報錯，但 IDE 無法提示。

**解決**：將類型產生加入自動化流程。

```bash
# 每次 migration 後執行
supabase db reset
supabase db lint --level warning
supabase gen types typescript --local | tee app/types/database.types.ts > /dev/null
pnpm typecheck  # 驗證類型正確性
```

---

## 類型檔案位置規範

| 類型種類    | 位置                          | 說明                  |
| ----------- | ----------------------------- | --------------------- |
| 資料庫類型  | `app/types/database.types.ts` | 自動產生，勿手動編輯  |
| 全域通用    | `shared/types/index.d.ts`     | `Maybe<T>` 等全域類型 |
| Client 專用 | `app/types/`                  | 元件、Store 相關類型  |
| Server 專用 | `server/types/`               | API、認證相關類型     |
| Zod Schema  | 與 API 同檔                   | 請求驗證 Schema       |

---

## 最佳實踐總結

1. **自動產生優先**：資料庫類型使用 `supabase gen types` 自動產生
2. **嚴格 Props**：Vue 元件 Props 使用 interface 定義
3. **統一處理 null**：使用 `Maybe&lt;T&gt;` 全域類型
4. **類型放對位置**：共用類型放 `shared/`，元件類型放 `app/types/`
5. **Zod 雙重保障**：Server API 使用 Zod 同時驗證和推導類型
6. **Migration 後更新**：每次資料庫變更後重新產生類型

---

## 延伸閱讀

- [Supabase TypeScript 支援](https://supabase.com/docs/guides/api/rest/generating-types)
- [Vue 3 TypeScript 指南](https://vuejs.org/guide/typescript/overview.html)
- [Zod 文件](https://zod.dev/)
- 上一篇：[Nuxt UI Dashboard 實戰](/nuxt/nuxt-ui-dashboard/)
- 下一篇：[nuxt-better-auth 認證整合](/nuxt/better-auth-integration/)
