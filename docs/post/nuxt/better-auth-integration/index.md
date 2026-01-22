---
title: nuxt-better-auth 認證整合
description: 使用 @onmax/nuxt-better-auth 實現完整的認證系統，包含 OAuth 社交登入、Session 管理與權限檢查。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - Authentication
  - OAuth
series: nuxt-fullstack
seriesTitle: Nuxt 4 全棧實戰
seriesOrder: 4
---

# nuxt-better-auth 認證整合

## 這篇要解決什麼問題

認證是每個應用程式的核心功能。這篇文章將說明：

- 為什麼捨棄 `@nuxtjs/supabase` 的內建 Auth
- `@onmax/nuxt-better-auth` 的完整用法
- OAuth 社交登入實作（Google）
- Client 與 Server 端的 Session 管理

---

## 為什麼不用 Supabase Auth？

Supabase 確實提供內建的 Auth 功能，但我們選擇 `@onmax/nuxt-better-auth` 的原因：

| 比較項目         | Supabase Auth       | nuxt-better-auth      |
| ---------------- | ------------------- | --------------------- |
| Session 管理     | 自己的 Session 機制 | 標準 HTTP-only Cookie |
| 與 Nuxt 整合     | 需額外設定          | 原生支援              |
| 自訂使用者欄位   | 受限於 auth.users   | 完全自訂              |
| 多 Provider 支援 | 良好                | 優秀                  |
| 角色權限         | 需自行實作          | 內建支援              |

**關鍵決策**：我們使用 `@nuxtjs/supabase` **僅作為資料庫存取**，認證完全交給 `@onmax/nuxt-better-auth`。

---

## 認證架構概覽

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  const { user, loggedIn, signIn, signOut } = useUserSession()    │
│  await signIn.social({ provider: 'google' })                     │
│  await signIn.email({ email, password })                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP-only Cookie
┌─────────────────────────────────────────────────────────────────┐
│                         Server (Nitro)                           │
├─────────────────────────────────────────────────────────────────┤
│  const { user } = await requireUserSession(event)                │
│  const { user } = await requireUserSession(event, {              │
│    user: { role: 'admin' }                                       │
│  })                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Service Role Key
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase (Database)                         │
├─────────────────────────────────────────────────────────────────┤
│  使用 Service Role Client 執行資料庫操作                          │
│  RLS 保護讀取操作                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 安裝與設定

### 安裝套件

```bash
pnpm add @onmax/nuxt-better-auth
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: [
    "@onmax/nuxt-better-auth",
    "@nuxtjs/supabase", // 僅作資料庫存取
    // ...
  ],
});
```

### Server 端設定

```typescript
// server/auth.config.ts
import { defineServerAuth } from "@onmax/nuxt-better-auth/config";

export default defineServerAuth({
  // 啟用 Email + Password 認證（開發測試用）
  emailAndPassword: { enabled: true },

  // OAuth providers
  socialProviders: {
    google: {
      clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
    },
  },

  // Session 設定
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 24, // 每 24 小時更新
  },
});
```

### Client 端設定

```typescript
// app/auth.config.ts
import { defineClientAuth } from "@onmax/nuxt-better-auth/config";

export default defineClientAuth({
  // 可在此加入 client-side plugins
  // plugins: [
  //   twoFactorClient(),
  //   passkeyClient(),
  // ]
});
```

---

## Client 端認證

### useUserSession 核心用法

```vue
&lt;script setup lang="ts"&gt; const { user, loggedIn, signIn, signOut, fetch }
= useUserSession() // 檢查登入狀態 if (loggedIn.value) {
console.log('使用者已登入:', user.value) } &lt;/script&gt;
```

### API 說明

```typescript
const {
  user, // Ref&lt;User | null&gt; - 當前使用者資料
  loggedIn, // ComputedRef&lt;boolean&gt; - 是否已登入
  signIn, // { social, email, ... } - 登入方法
  signOut, // () =&gt; Promise&lt;void&gt; - 登出
  fetch, // () =&gt; Promise&lt;void&gt; - 重新取得 session
} = useUserSession();
```

### OAuth 社交登入

```vue
&lt;template&gt; &lt;UButton @click="loginWithGoogle" icon="i-lucide-chrome"&gt;
使用 Google 登入 &lt;/UButton&gt; &lt;/template&gt; &lt;script setup
lang="ts"&gt; const { signIn } = useUserSession() async function
loginWithGoogle() { await signIn.social({ provider: 'google' }) //
登入成功後會自動導向 callback URL } &lt;/script&gt;
```

### Email/Password 登入

```vue
&lt;script setup lang="ts"&gt; const { signIn } = useUserSession() const toast =
useToast() const email = ref('') const password = ref('') async function
handleLogin() { try { await signIn.email( { email: email.value, password:
password.value }, { onSuccess: () =&gt; navigateTo('/') } ) } catch (error) {
toast.add({ title: '登入失敗', description: '請檢查帳號密碼是否正確', color:
'red', }) } } &lt;/script&gt;
```

### 登出

```vue
&lt;script setup lang="ts"&gt; const { signOut } = useUserSession() async
function handleLogout() { await signOut() navigateTo('/login') } &lt;/script&gt;
```

---

## Server 端認證

### 要求登入

```typescript
// server/api/v1/profile.get.ts
export default defineEventHandler(async (event) =&gt; {
  const { user } = await requireUserSession(event)
  // user 保證存在，否則會回傳 401

  return { message: `Hello, ${user.name}` }
})
```

### 要求特定角色

```typescript
// server/api/admin/users.get.ts
export default defineEventHandler(async (event) =&gt; {
  const { user } = await requireUserSession(event, {
    user: { role: ['admin', 'manager'] },
  })
  // 只有 admin 或 manager 可存取

  const supabase = getServerSupabaseClient()
  const { data } = await supabase.from('users').select('*')

  return { data }
})
```

### 取得 Session（可能為 null）

```typescript
// 當你需要判斷是否登入，而非強制要求
export default defineEventHandler(async (event) =&gt; {
  const session = await getUserSession(event)

  if (session?.user) {
    return { message: `歡迎回來，${session.user.name}` }
  }

  return { message: '請先登入' }
})
```

---

## Session 型別定義

### 擴充 User 型別

```typescript
// server/types/auth.d.ts
declare module "@onmax/nuxt-better-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    picture?: string;
    role: "admin" | "manager" | "staff" | "unauthorized";
  }
}
```

### 使用擴充後的型別

```typescript
const { user } = await requireUserSession(event);
// user.role 現在有完整的類型提示：'admin' | 'manager' | 'staff' | 'unauthorized'

if (user.role === "admin") {
  // 管理員專屬邏輯
}
```

---

## 路由保護

### nuxt.config.ts routeRules

```typescript
export default defineNuxtConfig({
  routeRules: {
    "/admin/**": { auth: { user: { role: "admin" } } },
    "/login": { auth: "guest" }, // 僅訪客可存取
    "/dashboard/**": { auth: "user" }, // 需登入
  },
});
```

### Client 端 Middleware

```typescript
// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) =&gt; {
  const { loggedIn, user } = useUserSession()

  // 公開頁面不需驗證
  const publicPages = ['/login', '/forbidden']
  if (publicPages.includes(to.path)) return

  // 未登入導向登入頁
  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  // 未授權角色導向 forbidden
  if (user.value?.role === 'unauthorized') {
    return navigateTo('/forbidden')
  }
})
```

---

## 環境變數設定

```bash
# .env
# Session 密鑰（至少 32 字元）
NUXT_SESSION_PASSWORD=your-super-secret-session-password-here

# Google OAuth（從 Google Cloud Console 取得）
NUXT_OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 踩坑經驗

### Session Cookie 設定錯誤

**問題**：登入成功但重新整理後變成未登入。

**原因**：Cookie 設定不正確，導致無法跨請求保持。

**解決**：確認以下設定：

```typescript
// server/auth.config.ts
export default defineServerAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 設定足夠長的過期時間
    updateAge: 60 * 60 * 24, // 自動更新機制
  },
});
```

### OAuth Callback URL 錯誤

**問題**：OAuth 登入後導向錯誤頁面。

**解決**：在 OAuth Provider 設定正確的 Callback URL：

- 本地開發：`http://localhost:3000/api/auth/callback/google`
- 生產環境：`https://your-domain.com/api/auth/callback/google`

### 忘記處理 unauthorized 角色

**問題**：新註冊用戶沒有角色，導致存取所有頁面都正常。

**解決**：預設角色為 `unauthorized`，並在 middleware 處理：

```typescript
// middleware/auth.global.ts
if (user.value?.role === "unauthorized") {
  return navigateTo("/forbidden");
}
```

---

## 錯誤處理建議

| 情境         | 錯誤碼 | 建議處理                         |
| ------------ | ------ | -------------------------------- |
| 未登入       | 401    | 導向 `/login`                    |
| 無權限       | 403    | 導向 `/forbidden` 或顯示錯誤訊息 |
| OAuth 取消   | -      | 提示「登入取消」，留在登入頁     |
| Session 過期 | 401    | 重新導向登入                     |

---

## 最佳實踐總結

1. **分離認證與資料庫**：使用 `nuxt-better-auth` 處理認證，Supabase 僅作資料庫
2. **型別定義**：擴充 User 型別以獲得完整的 TypeScript 支援
3. **雙重保護**：Client middleware + Server requireUserSession
4. **角色檢查**：Server 端永遠要驗證角色，不能只信任 Client
5. **預設 unauthorized**：新用戶預設無權限，由管理員授權

---

## 延伸閱讀

- [nuxt-better-auth 官方文件](https://github.com/onmax/nuxt-better-auth)
- [Better Auth 文件](https://www.better-auth.com/)
- 上一篇：[TypeScript 類型安全實戰](/nuxt/typescript-type-safety/)
- 下一篇：[角色權限系統設計](/nuxt/role-based-access-control/)
