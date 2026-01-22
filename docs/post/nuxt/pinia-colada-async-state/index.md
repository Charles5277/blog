---
title: Pinia Colada 非同步狀態管理
description: 使用 Pinia Colada 管理非同步狀態，實作 useQuery 查詢、useMutation 變更與快取策略。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - Nitro
  - Pinia
---

# Pinia Colada 非同步狀態管理

> 系列文章：Nuxt 4 全棧實戰（10/12）

## 這篇要解決什麼問題

非同步狀態管理是前端開發的核心挑戰。傳統做法需要手動處理：

- Loading 狀態追蹤
- 錯誤處理與重試
- 快取與資料同步
- 重複請求防止

這篇文章將說明如何用 Pinia Colada 優雅解決這些問題。

---

## 為什麼選擇 Pinia Colada

### vs TanStack Query

| 特性 | Pinia Colada | TanStack Query |
|-----|-------------|----------------|
| Vue 整合 | 原生支援 | 需要 adapter |
| Pinia 整合 | 無縫整合 | 獨立運作 |
| 學習曲線 | 較低 | 較高 |
| 生態系 | 較新 | 成熟 |
| DevTools | Vue DevTools 原生支援 | 需要獨立擴充 |
| Bundle Size | 較小 | 較大 |

### vs 純 Pinia

| 特性 | Pinia Colada | 純 Pinia |
|-----|-------------|----------|
| 快取管理 | 內建 | 需手動實作 |
| Loading/Error 狀態 | 自動追蹤 | 需手動管理 |
| 自動重新查詢 | 內建支援 | 需手動實作 |
| 樂觀更新 | 內建支援 | 需手動實作 |

---

## 安裝與設定

### 安裝套件

```bash
pnpm add @pinia/colada
```

### Nuxt 設定

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
  ],
})
```

---

## 目錄結構

```
app/
├── queries/              # Pinia Colada 查詢
│   ├── users.ts         # 使用者相關查詢
│   ├── resources.ts     # 資源相關查詢
│   └── options.ts       # 下拉選單選項查詢
├── stores/               # Pinia Stores（非同步狀態）
│   ├── userPreferences.ts
│   └── ui.ts
└── composables/          # 組合式函式
```

### queries/ vs stores/ 的分工

| 目錄 | 用途 | 範例 |
|-----|------|------|
| `queries/` | Server 資料快取 | 列表、單筆資料、下拉選項 |
| `stores/` | Client 狀態 | 使用者偏好、UI 狀態 |

---

## useQuery 查詢

### 基本用法

```typescript
// app/queries/users.ts
import { useQuery } from '@pinia/colada'

export function useUsersQuery() {
  return useQuery({
    key: ['users'],
    query: () => $fetch('/api/v1/users'),
  })
}

// 在元件中使用
const { data, status, error, refetch } = useUsersQuery()
```

### 回傳值說明

| 屬性 | 類型 | 說明 |
|-----|------|------|
| `data` | `Ref&lt;T \| undefined&gt;` | 查詢結果 |
| `status` | `Ref&lt;'pending' \| 'success' \| 'error'&gt;` | 查詢狀態 |
| `error` | `Ref&lt;Error \| null&gt;` | 錯誤物件 |
| `isLoading` | `ComputedRef&lt;boolean&gt;` | 是否載入中 |
| `refetch` | `() =&gt; Promise` | 手動重新查詢 |

### 帶參數的查詢

```typescript
export function useUserQuery(userId: MaybeRefOrGetter&lt;string&gt;) {
  return useQuery({
    key: () => ['users', toValue(userId)],
    query: () => $fetch(`/api/v1/users/${toValue(userId)}`),
    // userId 變化時自動重新查詢
  })
}

// 使用
const userId = ref('123')
const { data: user } = useUserQuery(userId)

// 變更 userId 會自動觸發新查詢
userId.value = '456'
```

### 分頁查詢

```typescript
export function useUsersListQuery(params: {
  page: MaybeRefOrGetter&lt;number&gt;
  pageSize: MaybeRefOrGetter&lt;number&gt;
  search?: MaybeRefOrGetter&lt;string&gt;
}) {
  return useQuery({
    key: () => [
      'users',
      'list',
      {
        page: toValue(params.page),
        pageSize: toValue(params.pageSize),
        search: toValue(params.search),
      },
    ],
    query: () =>
      $fetch('/api/v1/users', {
        query: {
          page: toValue(params.page),
          pageSize: toValue(params.pageSize),
          search: toValue(params.search),
        },
      }),
  })
}
```

### 下拉選單選項查詢

```typescript
// app/queries/options.ts
export function useRoleOptionsQuery() {
  return useQuery({
    key: ['options', 'roles'],
    query: async () => {
      const client = useSupabaseClient&lt;Database&gt;()
      const { data } = await client
        .from('roles')
        .select('id, name')
        .order('name')
      return data || []
    },
    staleTime: 10 * 60 * 1000, // 選項較少變動，快取 10 分鐘
  })
}
```

---

## useMutation 變更

### 基本用法

```typescript
import { useMutation, useQueryClient } from '@pinia/colada'

export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutation: (data: CreateUserInput) =>
      $fetch('/api/v1/users', {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      // 成功後使 users 列表快取失效
      queryClient.invalidateQueries({ key: ['users'] })
    },
  })
}
```

### 在元件中使用

```vue
&lt;script setup lang="ts"&gt;
const { mutate, status, error } = useCreateUserMutation()
const toast = useToast()

async function handleSubmit(formData: CreateUserInput) {
  try {
    await mutate(formData)
    toast.add({ title: '新增成功', color: 'green' })
  } catch (e) {
    toast.add({ title: '新增失敗', color: 'red' })
  }
}
&lt;/script&gt;
```

### 更新與刪除

```typescript
// 更新
export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutation: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      $fetch(`/api/v1/users/${id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (result, { id }) => {
      // 使單筆和列表快取都失效
      queryClient.invalidateQueries({ key: ['users', id] })
      queryClient.invalidateQueries({ key: ['users', 'list'] })
    },
  })
}

// 刪除
export function useDeleteUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutation: (id: string) =>
      $fetch(`/api/v1/users/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ key: ['users'] })
    },
  })
}
```

---

## 樂觀更新

### 提升使用者體驗

樂觀更新在請求發送前就更新 UI，讓操作感覺更即時：

```typescript
export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutation: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      $fetch(`/api/v1/users/${id}`, {
        method: 'PATCH',
        body: data,
      }),

    onMutate: async ({ id, data }) => {
      // 1. 取消正在進行的查詢（避免覆蓋樂觀更新）
      await queryClient.cancelQueries({ key: ['users', id] })

      // 2. 保存舊資料（用於回滾）
      const previousUser = queryClient.getQueryData(['users', id])

      // 3. 樂觀更新快取
      queryClient.setQueryData(['users', id], (old: User) => ({
        ...old,
        ...data,
      }))

      // 4. 回傳 context 供 onError 使用
      return { previousUser }
    },

    onError: (error, { id }, context) => {
      // 錯誤時回滾到舊資料
      if (context?.previousUser) {
        queryClient.setQueryData(['users', id], context.previousUser)
      }
    },

    onSettled: (result, error, { id }) => {
      // 無論成功或失敗，最後都重新查詢確保資料正確
      queryClient.invalidateQueries({ key: ['users', id] })
    },
  })
}
```

### 樂觀更新流程圖

```
使用者點擊儲存
       │
       ▼
┌──────────────────┐
│  onMutate        │
│  ├─ 取消進行中查詢 │
│  ├─ 保存舊資料    │
│  └─ 樂觀更新 UI   │ ← 立即顯示新值
└──────────────────┘
       │
       ▼ 發送 API 請求
       │
   ┌───┴───┐
   │       │
成功 ▼     ▼ 失敗
   │       │
   │  ┌────┴────┐
   │  │ onError │
   │  │ 回滾資料 │ ← 恢復舊值
   │  └─────────┘
   │       │
   └───┬───┘
       │
       ▼
┌──────────────────┐
│  onSettled       │
│  重新查詢確保正確  │
└──────────────────┘
```

---

## 快取策略

### staleTime vs gcTime

```typescript
useQuery({
  key: ['users'],
  query: () => $fetch('/api/v1/users'),
  staleTime: 5 * 60 * 1000,   // 5 分鐘內視為新鮮，不會重新請求
  gcTime: 10 * 60 * 1000,     // 10 分鐘後從記憶體清除
})
```

| 參數 | 說明 | 建議值 |
|-----|------|--------|
| `staleTime` | 資料多久後視為過期 | 依資料變動頻率設定 |
| `gcTime` | 快取保留多久後清除 | 通常設為 staleTime 的 2 倍 |

### 不同資料的快取策略

```typescript
// 變動頻繁的資料（如儀表板）
useQuery({
  key: ['dashboard'],
  query: () => $fetch('/api/v1/dashboard'),
  staleTime: 30 * 1000,       // 30 秒
  refetchInterval: 60 * 1000, // 每分鐘自動重新查詢
})

// 較少變動的資料（如下拉選項）
useQuery({
  key: ['options', 'categories'],
  query: () => $fetch('/api/v1/categories'),
  staleTime: 30 * 60 * 1000,  // 30 分鐘
})

// 幾乎不變的資料（如設定）
useQuery({
  key: ['config'],
  query: () => $fetch('/api/v1/config'),
  staleTime: Infinity,        // 永不過期
})
```

---

## 手動控制快取

### 使快取失效

```typescript
const queryClient = useQueryClient()

// 使特定查詢失效
queryClient.invalidateQueries({ key: ['users', '123'] })

// 使所有 users 相關查詢失效
queryClient.invalidateQueries({ key: ['users'] })

// 使所有查詢失效
queryClient.invalidateQueries()
```

### 直接設定快取資料

```typescript
// 設定快取資料（不觸發重新查詢）
queryClient.setQueryData(['users', '123'], newUserData)

// 取得快取資料
const cachedUser = queryClient.getQueryData(['users', '123'])
```

---

## 與 Pinia Store 搭配

### Store 管理 Client 狀態

```typescript
// app/stores/userPreferences.ts
export const useUserPreferencesStore = defineStore('user-preferences', () => {
  const primaryColor = ref('blue')
  const sidebarCollapsed = ref(false)

  function setPrimaryColor(color: string) {
    primaryColor.value = color
  }

  return {
    primaryColor: readonly(primaryColor),
    sidebarCollapsed,
    setPrimaryColor,
  }
})
```

### Query 管理 Server 資料

```typescript
// app/queries/users.ts
export function useCurrentUserQuery() {
  const { user } = useUserSession()

  return useQuery({
    key: () => ['users', user.value?.id],
    query: () => $fetch(`/api/v1/users/${user.value?.id}`),
    enabled: () => !!user.value?.id,  // 只在登入後查詢
  })
}
```

### 組合使用

```vue
&lt;script setup lang="ts"&gt;
// Client 狀態用 Store
const preferencesStore = useUserPreferencesStore()
const { primaryColor } = storeToRefs(preferencesStore)

// Server 資料用 Query
const { data: user, isLoading } = useCurrentUserQuery()
&lt;/script&gt;
```

---

## 踩坑經驗

### 快取 Key 設計錯誤

**問題**：mutation 後 invalidate 沒有清除對應的快取。

```typescript
// ❌ 錯誤：key 不一致
// query
useQuery({ key: ['user', userId] })

// mutation invalidate
queryClient.invalidateQueries({ key: ['users', userId] })  // users vs user
```

**解決**：統一 key 命名規則。

```typescript
// ✅ 正確：使用一致的命名
// 單筆：['users', id]
// 列表：['users', 'list', params]
// 選項：['users', 'options']
```

### 忘記處理 enabled 條件

**問題**：userId 為 undefined 時仍然發送請求。

```typescript
// ❌ 錯誤：會發送 /api/v1/users/undefined
useQuery({
  key: () => ['users', toValue(userId)],
  query: () => $fetch(`/api/v1/users/${toValue(userId)}`),
})
```

**解決**：加上 enabled 條件。

```typescript
// ✅ 正確：userId 存在才查詢
useQuery({
  key: () => ['users', toValue(userId)],
  query: () => $fetch(`/api/v1/users/${toValue(userId)}`),
  enabled: () => !!toValue(userId),
})
```

### 樂觀更新沒有回滾

**問題**：API 失敗但 UI 仍顯示錯誤的值。

**解決**：確保 onError 中有回滾邏輯，並在 onSettled 中重新查詢。

---

## 檢查清單

建立新 Query/Mutation 時確認：

- [ ] Key 設計一致（單筆 `['resource', id]`、列表 `['resource', 'list']`）
- [ ] 需要參數的查詢使用 `MaybeRefOrGetter` 類型
- [ ] 條件查詢加上 `enabled` 選項
- [ ] Mutation 成功後 `invalidateQueries` 清除相關快取
- [ ] 需要樂觀更新時實作 `onMutate` + `onError` + `onSettled`
- [ ] 依資料特性設定適當的 `staleTime`

---

## 最佳實踐總結

1. **分離關注點**：Query 管理 Server 資料，Store 管理 Client 狀態
2. **統一 Key 設計**：`['resource', id]` 或 `['resource', 'list', params]`
3. **合理的快取時間**：依資料變動頻率設定 `staleTime`
4. **樂觀更新**：提升 UX，但要完整處理回滾
5. **條件查詢**：使用 `enabled` 避免無效請求
6. **集中管理**：Query 函式放在 `app/queries/` 目錄

---

## 延伸閱讀

- [Pinia Colada 文件](https://pinia-colada.esm.dev/)
- [Pinia 官方文檔](https://pinia.vuejs.org/)
- 上一篇：[Nitro Server API 設計模式](/nuxt/nitro-api-design/)
- 下一篇：[TDD 與自動化測試](/nuxt/tdd-testing-workflow/)
