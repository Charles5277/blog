---
title: 角色權限系統設計
description: 實作 RBAC 角色權限控制，涵蓋 Client 端路由守衛、Server 端權限檢查、與 nuxt.config 的 routeRules 設定。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - Authentication
  - OAuth
---

# 角色權限系統設計

> 系列文章：Nuxt 4 全棧實戰（5/12）

## 這篇要解決什麼問題

有了認證之後，下一步就是**授權**。這篇文章將說明：

- 角色階層的設計考量
- Client 端 middleware 路由守衛
- Server 端 requireUserSession 權限檢查
- nuxt.config.ts 的 routeRules 設定

---

## 角色階層設計

### 角色定義

```typescript
// server/types/auth.d.ts
type UserRole = "admin" | "manager" | "staff" | "unauthorized";

// 角色階層：admin > manager > staff > unauthorized
```

### 角色說明

| 角色           | 說明       | 典型使用場景     |
| -------------- | ---------- | ---------------- |
| `admin`        | 系統管理員 | 完整系統控制權   |
| `manager`      | 管理者     | 管理資源與使用者 |
| `staff`        | 一般員工   | 日常操作權限     |
| `unauthorized` | 未授權     | 新註冊用戶預設   |

### 權限矩陣

| 功能       | admin | manager | staff | unauthorized |
| ---------- | ----- | ------- | ----- | ------------ |
| 系統設定   | ✅    | ❌      | ❌    | ❌           |
| 使用者管理 | ✅    | ✅      | ❌    | ❌           |
| 資料編輯   | ✅    | ✅      | ✅    | ❌           |
| 資料檢視   | ✅    | ✅      | ✅    | ❌           |
| 登入頁面   | ❌    | ❌      | ❌    | ✅           |

---

## 權限檢查架構

```
使用者請求
    │
    ▼
┌─────────────────────────────────────────┐
│        Client Middleware (快速)          │
├─────────────────────────────────────────┤
│  - 未登入 → 導向 /login                   │
│  - unauthorized → 導向 /forbidden         │
│  - 角色不符 → 導向錯誤頁                   │
└─────────────────────────────────────────┘
    │ 通過
    ▼
┌─────────────────────────────────────────┐
│         Server API (安全)                │
├─────────────────────────────────────────┤
│  - requireUserSession(event)             │
│  - requireUserSession(event, {           │
│      user: { role: ['admin', 'manager'] }│
│    })                                    │
└─────────────────────────────────────────┘
    │ 通過
    ▼
執行業務邏輯
```

**重要原則**：Client 端檢查是為了 UX（快速回饋），Server 端檢查是為了安全。**永遠不能只信任 Client 端**。

---

## Client 端路由守衛

### Global Middleware

```typescript
// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) =&gt; {
  const { loggedIn, user } = useUserSession()

  // 公開頁面清單
  const publicPages = ['/login', '/register', '/forbidden']
  if (publicPages.includes(to.path)) {
    return
  }

  // 未登入導向登入頁
  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  // unauthorized 角色導向 forbidden
  if (user.value?.role === 'unauthorized') {
    return navigateTo('/forbidden')
  }

  // 管理員頁面權限檢查
  if (to.path.startsWith('/admin')) {
    if (user.value?.role !== 'admin') {
      return navigateTo('/forbidden')
    }
  }
})
```

### 角色階層檢查函式

```typescript
// app/utils/permission.ts
const ROLE_HIERARCHY: Record&lt;string, number&gt; = {
  admin: 4,
  manager: 3,
  staff: 2,
  unauthorized: 1,
}

export function hasRole(
  userRole: string | undefined,
  requiredRole: string
): boolean {
  if (!userRole) return false
  return (ROLE_HIERARCHY[userRole] ?? 0) &gt;= (ROLE_HIERARCHY[requiredRole] ?? 0)
}

// 使用範例
if (hasRole(user.value?.role, 'manager')) {
  // 有 manager 或更高權限
}
```

---

## Server 端權限檢查

### 基本用法

```typescript
// server/api/v1/profile.get.ts
export default defineEventHandler(async (event) =&gt; {
  // 只要求登入
  const { user } = await requireUserSession(event)

  return { name: user.name, email: user.email }
})
```

### 要求特定角色

```typescript
// server/api/admin/users.get.ts
export default defineEventHandler(async (event) =&gt; {
  // 要求 admin 或 manager 角色
  const { user } = await requireUserSession(event, {
    user: { role: ['admin', 'manager'] },
  })

  const supabase = getServerSupabaseClient()
  const { data } = await supabase.from('users').select('*')

  return { data }
})
```

### 手動權限檢查

```typescript
// server/api/v1/resources/[resourceId].patch.ts
export default defineEventHandler(async (event) =&gt; {
  const { user } = await requireUserSession(event)
  const resourceId = getRouterParam(event, 'resourceId')

  // 取得資源
  const supabase = getServerSupabaseClient()
  const { data: resource } = await supabase
    .from('resources')
    .select('owner_id')
    .eq('id', resourceId)
    .single()

  // 檢查權限：擁有者或管理員可編輯
  const isOwner = resource?.owner_id === user.id
  const isAdmin = ['admin', 'manager'].includes(user.role)

  if (!isOwner &amp;&amp; !isAdmin) {
    throw createError({
      statusCode: 403,
      message: '您沒有權限編輯此資源',
    })
  }

  // 執行更新...
})
```

---

## routeRules 設定

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  routeRules: {
    // 公開頁面
    "/login": { auth: "guest" },
    "/register": { auth: "guest" },

    // 需要登入
    "/dashboard/**": { auth: "user" },

    // 管理員專用
    "/admin/**": {
      auth: { user: { role: "admin" } },
    },

    // 管理者以上
    "/manage/**": {
      auth: { user: { role: ["admin", "manager"] } },
    },
  },
});
```

### 路由規則說明

| 規則                                   | 意義                 |
| -------------------------------------- | -------------------- |
| `auth: 'guest'`                        | 僅未登入用戶可存取   |
| `auth: 'user'`                         | 需要登入（任何角色） |
| `auth: { user: { role: 'admin' } }`    | 需要特定角色         |
| `auth: { user: { role: ['a', 'b'] } }` | 需要任一角色         |

---

## 頁面層級權限

### 使用 definePageMeta

```vue
&lt;!-- pages/admin/settings.vue --&gt; &lt;script setup lang="ts"&gt;
definePageMeta({ auth: { user: { role: 'admin' } } }) &lt;/script&gt;
&lt;template&gt; &lt;div&gt; &lt;h1&gt;系統設定&lt;/h1&gt; &lt;!-- 只有 admin
看得到 --&gt; &lt;/div&gt; &lt;/template&gt;
```

### 條件顯示 UI 元素

```vue
&lt;script setup lang="ts"&gt; const { user } = useUserSession() const
canManageUsers = computed(() =&gt; { return ['admin',
'manager'].includes(user.value?.role ?? '') }) const canEditSettings =
computed(() =&gt; { return user.value?.role === 'admin' }) &lt;/script&gt;
&lt;template&gt; &lt;UNavigationMenu :items="menuItems"&gt; &lt;!--
根據權限顯示選單項目 --&gt; &lt;/UNavigationMenu&gt; &lt;UButton
v-if="canManageUsers" to="/manage/users"&gt; 使用者管理 &lt;/UButton&gt;
&lt;UButton v-if="canEditSettings" to="/admin/settings"&gt; 系統設定
&lt;/UButton&gt; &lt;/template&gt;
```

---

## 動態選單根據角色

```typescript
// app/composables/useMenuItems.ts
import type { NavigationMenuItem } from '@nuxt/ui'

export function useMenuItems() {
  const { user } = useUserSession()

  const menuItems = computed&lt;NavigationMenuItem[]&gt;(() =&gt; {
    const items: NavigationMenuItem[] = [
      { label: '儀表板', icon: 'i-lucide-layout-dashboard', to: '/' },
    ]

    // staff 以上可見
    if (hasRole(user.value?.role, 'staff')) {
      items.push({
        label: '資料管理',
        icon: 'i-lucide-database',
        to: '/data',
      })
    }

    // manager 以上可見
    if (hasRole(user.value?.role, 'manager')) {
      items.push({
        label: '使用者管理',
        icon: 'i-lucide-users',
        to: '/manage/users',
      })
    }

    // admin 專屬
    if (user.value?.role === 'admin') {
      items.push({
        label: '系統設定',
        icon: 'i-lucide-settings',
        to: '/admin/settings',
      })
    }

    return items
  })

  return { menuItems }
}
```

---

## 踩坑經驗

### 忘記處理 unauthorized 角色

**問題**：新用戶註冊後可以存取所有需要登入的頁面。

**原因**：只檢查 `loggedIn`，沒有檢查角色。

```typescript
// ❌ 錯誤：只檢查登入狀態
if (!loggedIn.value) {
  return navigateTo("/login");
}
// 新用戶（unauthorized）會通過檢查

// ✅ 正確：同時檢查角色
if (!loggedIn.value) {
  return navigateTo("/login");
}
if (user.value?.role === "unauthorized") {
  return navigateTo("/forbidden");
}
```

### 只在 Client 端檢查權限

**問題**：API 被直接呼叫時沒有權限保護。

**解決**：Server API 必須獨立驗證權限。

```typescript
// ✅ Server 端獨立檢查
export default defineEventHandler(async (event) =&gt; {
  const { user } = await requireUserSession(event, {
    user: { role: ['admin', 'manager'] },
  })
  // 即使 Client 繞過，Server 也會擋住
})
```

### 權限檢查散落各處

**問題**：權限邏輯分散在多個檔案，難以維護。

**解決**：建立統一的權限檢查工具。

```typescript
// app/utils/permission.ts - 集中管理
export const PERMISSIONS = {
  MANAGE_USERS: ["admin", "manager"],
  EDIT_SETTINGS: ["admin"],
  VIEW_DATA: ["admin", "manager", "staff"],
} as const;

export function can(
  userRole: string | undefined,
  permission: keyof typeof PERMISSIONS,
): boolean {
  if (!userRole) return false;
  return PERMISSIONS[permission].includes(userRole as any);
}
```

---

## 最佳實踐總結

1. **雙重檢查**：Client 端 + Server 端都要檢查權限
2. **預設拒絕**：未定義權限的路由預設拒絕存取
3. **角色階層**：使用數值比較實現角色繼承
4. **集中管理**：權限邏輯放在 `utils/permission.ts` 統一維護
5. **預設 unauthorized**：新用戶預設無權限，需管理員授權

---

## 延伸閱讀

- [Nuxt Middleware 文件](https://nuxt.com/docs/guide/directory-structure/middleware)
- [RBAC 設計模式](https://en.wikipedia.org/wiki/Role-based_access_control)
- 上一篇：[nuxt-better-auth 認證整合](/nuxt/better-auth-integration/)
- 下一篇：[Supabase Local-First 開發流程](/nuxt/supabase-local-first/)
