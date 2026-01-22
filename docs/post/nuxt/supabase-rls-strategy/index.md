---
title: RLS 與「讀 Client，寫 Server」策略
description: 設計安全的 Supabase RLS 政策，實作 Client 端唯讀、Server 端寫入的資料存取策略。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - Supabase
  - PostgreSQL
  - RLS
---

# RLS 與「讀 Client，寫 Server」策略

> 系列文章：Nuxt 4 全棧實戰（7/12）

## 這篇要解決什麼問題

Row Level Security (RLS) 是 Supabase 的核心安全機制。這篇文章將說明：

- RLS 的核心概念
- 為什麼採用「讀 Client，寫 Server」策略
- service_role 繞過 RLS 的必要性
- 常見的 RLS 陷阱與除錯技巧

---

## RLS 核心概念

### 什麼是 Row Level Security

RLS 讓你可以在**資料列層級**控制存取權限，而非只在表層級。

```sql
-- 使用者只能看到自己的資料
CREATE POLICY "Users can view own data"
ON public.users FOR SELECT
USING (auth.uid() = id);
```

### 啟用 RLS

```sql
-- 新建表後立即啟用 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 強制所有使用者（包括 table owner）都要通過 RLS
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;
```

---

## 「讀 Client，寫 Server」策略

### 架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
├─────────────────────────────────────────────────────────────┤
│  useSupabaseClient()                                         │
│  ├── .select() ✅ 允許（RLS 保護）                           │
│  ├── .insert() ❌ 禁止                                       │
│  ├── .update() ❌ 禁止                                       │
│  └── .delete() ❌ 禁止                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server API                                │
├─────────────────────────────────────────────────────────────┤
│  getServerSupabaseClient() (service_role)                    │
│  ├── 權限檢查 (requireUserSession)                           │
│  ├── 業務邏輯驗證                                            │
│  └── .insert() / .update() / .delete() ✅ 允許              │
└─────────────────────────────────────────────────────────────┘
```

### 為什麼這樣設計

| 操作                 | 端點   | 原因                             |
| -------------------- | ------ | -------------------------------- |
| SELECT               | Client | RLS 保護，減少延遲，即時性高     |
| INSERT/UPDATE/DELETE | Server | 集中權限檢查、日誌記錄、業務驗證 |

### Client 端唯讀查詢

```typescript
// ✅ 正確 - Client 端只做查詢
const client = useSupabaseClient&lt;Database&gt;()
const { data } = await client
  .from('users')
  .select('id, name, email')
  .order('created_at', { ascending: false })
```

### Server 端寫入

```typescript
// ✅ 正確 - 透過 Server API 寫入
await $fetch('/api/v1/users', {
  method: 'POST',
  body: { name: 'New User', email: 'user@example.com' },
})

// Server API 內部使用 service_role
// server/api/v1/users/index.post.ts
export default defineEventHandler(async (event) =&gt; {
  const { user } = await requireUserSession(event)
  const body = await readBody(event)

  const supabase = getServerSupabaseClient()
  const { data, error } = await supabase
    .from('users')
    .insert({ ...body, created_by: user.id })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { data }
})
```

---

## service_role 繞過 RLS

### 為什麼 Server API 需要繞過 RLS

Server API 使用 service_role key，可以繞過 RLS 政策。這是因為：

1. **Server 端已經做過權限檢查**：`requireUserSession` 驗證身份與角色
2. **需要執行跨使用者的操作**：管理員查看所有使用者資料
3. **效能考量**：避免 RLS 檢查的額外開銷

### RLS Policy 必須包含 service_role 繞過

```sql
-- ✅ 正確：包含 service_role 繞過
CREATE POLICY "Allow manager update" ON public.users FOR UPDATE
USING (
  (SELECT auth.role()) = 'service_role'  -- ⚠️ 必須加這行！
  OR public.current_user_role() IN ('admin', 'manager')
);

-- ❌ 錯誤：缺少 service_role 繞過
CREATE POLICY "Allow manager update" ON public.users FOR UPDATE
USING (
  public.current_user_role() IN ('admin', 'manager')
);
```

---

## Policy 模板

### 讀取政策（SELECT）

```sql
-- 登入使用者可讀取
CREATE POLICY "Authenticated users can read" ON public.resources
FOR SELECT USING (
  (SELECT auth.role()) = 'service_role'
  OR (SELECT auth.role()) = 'authenticated'
);

-- 僅特定角色可讀取
CREATE POLICY "Staff can read" ON public.sensitive_data
FOR SELECT USING (
  (SELECT auth.role()) = 'service_role'
  OR public.current_user_role() IN ('admin', 'manager', 'staff')
);
```

### 寫入政策（INSERT/UPDATE/DELETE）

```sql
-- Manager 以上可寫入
CREATE POLICY "Manager can insert" ON public.resources
FOR INSERT WITH CHECK (
  (SELECT auth.role()) = 'service_role'
  OR public.current_user_role() IN ('admin', 'manager')
);

CREATE POLICY "Manager can update" ON public.resources
FOR UPDATE USING (
  (SELECT auth.role()) = 'service_role'
  OR public.current_user_role() IN ('admin', 'manager')
);

CREATE POLICY "Manager can delete" ON public.resources
FOR DELETE USING (
  (SELECT auth.role()) = 'service_role'
  OR public.current_user_role() IN ('admin', 'manager')
);
```

### 僅限 Admin

```sql
CREATE POLICY "Admin only" ON public.system_settings
FOR ALL USING (
  (SELECT auth.role()) = 'service_role'
  OR public.current_user_role() = 'admin'
);
```

---

## 效能優化

### 使用子查詢快取

```sql
-- ✅ 效能好：使用 (SELECT ...) 包裝，讓 Postgres 快取結果
USING ((SELECT auth.role()) = 'service_role')

-- ❌ 效能差：每行都會重新計算
USING (auth.role() = 'service_role')
```

### 使用 Helper 函式

```sql
-- ✅ 正確：使用 helper 函式
public.current_user_role()
public.current_user_id()

-- ❌ 錯誤：直接查表（效能差、容易出錯）
SELECT role FROM public.user_roles WHERE id = auth.uid()
```

### 建立索引

```sql
-- 如果 policy 經常用到某欄位，確保有索引
CREATE INDEX idx_resources_owner ON public.resources(owner_id);
CREATE INDEX idx_resources_department ON public.resources(department_id);
```

---

## 踩坑經驗

### Toast 成功但資料沒變

這是最常見的 RLS 陷阱：

**症狀**：

1. API 回傳成功
2. Toast 顯示「儲存成功」
3. 重新整理後資料沒變

**原因**：

- service_role 繞過了 SELECT policy（所以能讀到資料）
- 但 UPDATE/DELETE policy 沒有加 service_role 繞過
- 結果：UPDATE 執行但影響 0 行（因為 RLS 過濾掉了）

**解法**：所有 CUD 操作的 policy 都要加 service_role 繞過。

### 查詢回傳空陣列

**症狀**：`SELECT * FROM table` 回傳空陣列，但資料確實存在。

**原因**：SELECT policy 沒有允許當前使用者。

**除錯**：

```sql
-- 檢查現有 Policy
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- 以特定使用者身份測試
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "user-uuid-here"}';
SELECT * FROM public.your_table;
```

### 查詢很慢

**原因**：Policy 中有複雜子查詢。

**解法**：改用 helper 函式或加索引。

```sql
-- ❌ 避免：複雜的子查詢會影響效能
USING (
  EXISTS (
    SELECT 1 FROM public.permissions
    WHERE user_id = auth.uid() AND resource_id = your_table.id
  )
)

-- ✅ 改用 helper 函式封裝邏輯
USING (public.can_read_resource(your_table.id))
```

---

## 常見問題速查

| 症狀                 | 原因                   | 解法                                          |
| -------------------- | ---------------------- | --------------------------------------------- |
| Toast 成功但資料沒變 | 缺少 service_role 繞過 | 加上 `(SELECT auth.role()) = 'service_role'`  |
| 查詢回傳空陣列       | RLS 未開放讀取         | 檢查 SELECT policy                            |
| 查詢很慢             | Policy 中有複雜子查詢  | 改用 helper 函式或加索引                      |
| API 回傳 HTML        | 路由衝突               | 避免同目錄下同時用 `[id].ts` 和 `[id]/xxx.ts` |

---

## 檢查清單

建立 RLS Policy 前確認：

- [ ] 包含 `(SELECT auth.role()) = 'service_role'` 繞過
- [ ] 使用 `(SELECT ...)` 包裝 auth 函式
- [ ] 使用 helper 函式而非直接查表
- [ ] 寫入操作（INSERT/UPDATE/DELETE）都有對應 policy
- [ ] 相關欄位已建立索引
- [ ] `supabase db lint --level warning` 無警告

---

## 最佳實踐總結

1. **Client 只讀**：`useSupabaseClient` 只用於 SELECT
2. **Server 寫入**：所有 CUD 操作透過 `/api/` 路由
3. **service_role 繞過**：CUD policy 必須加 service_role 繞過
4. **效能優化**：使用 `(SELECT ...)` 包裝、helper 函式、索引
5. **測試驗證**：每次修改 RLS 後都要測試

---

## 延伸閱讀

- [Supabase RLS 文件](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 官方文件](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- 上一篇：[Supabase Local-First 開發流程](/nuxt/supabase-local-first/)
- 下一篇：[Database Function 安全規範](/nuxt/supabase-function-security/)
