---
title: Database Function 安全規範
description: 撰寫安全的 Supabase Database Function，涵蓋 search_path、SECURITY DEFINER、與 supabase db lint 檢查。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - Supabase
  - PostgreSQL
  - RLS
series: nuxt-fullstack
seriesTitle: Nuxt 4 全棧實戰筆記
seriesOrder: 8
---

## 這篇要解決什麼問題

Database Function 是處理複雜業務邏輯的利器，但也是安全漏洞的溫床。這篇文章將說明：

- `SET search_path = ''` 為什麼是強制要求
- SECURITY DEFINER vs SECURITY INVOKER 的選擇
- View 的 `security_invoker = true` 設定
- supabase db lint 安全檢查

---

## search_path 安全漏洞

### 為什麼必須設為空字串

```sql
-- ❌ 危險 - 可能被 schema 注入攻擊
CREATE FUNCTION get_user()
RETURNS text AS $$
  SELECT name FROM users WHERE id = auth.uid();
$$ LANGUAGE sql;

-- ✅ 安全 - 使用完整 schema 名稱
CREATE FUNCTION public.get_user()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT name FROM public.users WHERE id = auth.uid();
$$;
```

### 攻擊原理

如果不設定 `search_path = ''`，攻擊者可能：

1. 建立一個同名的惡意 schema
2. 在其中放置同名的惡意 table 或 function
3. 你的 function 可能會存取到惡意物件
4. 導致資料外洩或權限提升

```
┌──────────────────────────────────────────────────┐
│  search_path = 'public, pg_temp'                 │
│  → SELECT * FROM users                           │
│  → 可能存取到 pg_temp.users（攻擊者建立的）      │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  search_path = ''                                │
│  → SELECT * FROM public.users                    │
│  → 一定存取到 public.users                       │
└──────────────────────────────────────────────────┘
```

---

## SECURITY DEFINER vs INVOKER

### SECURITY DEFINER

以**函式建立者**的權限執行，適用於：

- 需要存取使用者無權存取的資料
- 實作跨使用者的管理功能
- 封裝敏感邏輯

```sql
-- 以建立者權限執行（通常是 postgres 超級用戶）
CREATE FUNCTION public.admin_get_all_users()
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER  -- 使用 DEFINER
SET search_path = ''
AS $$
BEGIN
  -- 即使呼叫者沒有 SELECT 權限，也能執行
  RETURN QUERY SELECT * FROM public.users;
END;
$$;

-- 限制誰可以呼叫
GRANT EXECUTE ON FUNCTION public.admin_get_all_users TO service_role;
```

### SECURITY INVOKER

以**呼叫者**的權限執行，適用於：

- 一般業務邏輯
- 需要遵守 RLS 的操作
- 更安全的預設選擇

```sql
-- 以呼叫者權限執行
CREATE FUNCTION public.get_my_profile()
RETURNS public.users
LANGUAGE plpgsql
SECURITY INVOKER  -- 使用 INVOKER
SET search_path = ''
AS $$
BEGIN
  -- 會受到呼叫者的 RLS 限制
  RETURN QUERY
  SELECT * FROM public.users WHERE id = auth.uid();
END;
$$;
```

### 選擇建議

| 場景          | 建議                                 |
| ------------- | ------------------------------------ |
| 一般查詢/更新 | SECURITY INVOKER                     |
| 管理員功能    | SECURITY DEFINER + 權限檢查          |
| 跨使用者操作  | SECURITY DEFINER + 權限檢查          |
| 系統維護      | SECURITY DEFINER + 僅限 service_role |

---

## View 的 security_invoker 設定

### 為什麼 View 需要特別處理

View 預設以**建立者權限**執行，可能繞過 RLS：

```sql
-- ❌ 危險 - 可能繞過 RLS
CREATE VIEW public.user_summary AS
SELECT id, name, email FROM public.users;

-- ✅ 安全 - 明確使用呼叫者權限
CREATE VIEW public.user_summary
WITH (security_invoker = true)
AS
SELECT id, name, email FROM public.users;
```

### security_invoker = true 的效果

```
呼叫 VIEW
    │
    ▼ security_invoker = false（預設）
┌────────────────────────────────────────┐
│  以 VIEW 建立者權限執行                  │
│  → 繞過呼叫者的 RLS 限制                 │
│  → 可能看到不該看的資料                  │
└────────────────────────────────────────┘

    ▼ security_invoker = true
┌────────────────────────────────────────┐
│  以呼叫者權限執行                        │
│  → 遵守呼叫者的 RLS 限制                 │
│  → 只能看到有權限的資料                  │
└────────────────────────────────────────┘
```

---

## supabase db lint 安全檢查

### 必須零警告

```bash
# 執行安全檢查
supabase db lint --level warning
```

### 常見警告與修正

| 警告                           | 原因                            | 修正                                        |
| ------------------------------ | ------------------------------- | ------------------------------------------- |
| `function_search_path_mutable` | 函式缺少 `SET search_path = ''` | 加入 `SET search_path = ''`                 |
| `security_invoker_not_set`     | View 缺少 `security_invoker`    | 加入 `WITH (security_invoker = true)`       |
| `rls_disabled`                 | 表沒有啟用 RLS                  | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` |

### 提交前檢查

```bash
# 提交前必須執行
supabase db lint --level warning

# 如果有警告，修正後重新檢查
# 絕不提交有警告的 migration
```

---

## 函式模板

### 標準安全函式模板

```sql
CREATE OR REPLACE FUNCTION public.my_function(
  p_param1 uuid,
  p_param2 text DEFAULT NULL
)
RETURNS TABLE (id uuid, name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- 1. 權限檢查（如需要）
  IF public.current_user_role() NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  -- 2. 參數驗證（如需要）
  IF p_param1 IS NULL THEN
    RAISE EXCEPTION 'param1 is required';
  END IF;

  -- 3. 業務邏輯（使用完整 schema 名稱）
  RETURN QUERY
  SELECT t.id, t.name
  FROM public.some_table t
  WHERE t.param = p_param1;
END;
$$;

-- 4. 設定權限（限制誰可以呼叫）
GRANT EXECUTE ON FUNCTION public.my_function TO authenticated;
```

### Helper 函式模板

```sql
-- 取得當前使用者角色
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = auth.uid()),
    'unauthorized'
  )::text;
$$;

-- 取得當前使用者 ID
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT auth.uid();
$$;
```

### View 模板

```sql
CREATE OR REPLACE VIEW public.user_summary
WITH (security_invoker = true)
AS
SELECT
  u.id,
  u.name,
  u.email,
  ur.role
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;

-- 設定權限
GRANT SELECT ON public.user_summary TO authenticated;
```

---

## 踩坑經驗

### search_path 漏洞的真實案例

**問題**：建立函式時沒有設定 `search_path = ''`。

**後果**：`supabase db lint` 一直報警告 `function_search_path_mutable`。

**解決**：所有函式都要加上：

```sql
SET search_path = ''
```

### 忘記使用完整 schema 名稱

**問題**：設定了 `search_path = ''`，但 SQL 內沒有使用完整名稱。

```sql
-- ❌ 錯誤：search_path = '' 但沒有 schema 前綴
SET search_path = ''
AS $$
  SELECT * FROM users;  -- 會報錯：relation "users" does not exist
$$;

-- ✅ 正確：使用完整 schema 名稱
SET search_path = ''
AS $$
  SELECT * FROM public.users;  -- 正確
$$;
```

### View 忘記設定 security_invoker

**問題**：建立 View 後，普通使用者可以看到所有資料。

**原因**：View 預設以建立者權限執行，繞過了 RLS。

**解決**：所有 View 都要加上 `WITH (security_invoker = true)`。

---

## 檢查清單

提交 Migration 前確認：

- [ ] 所有函式都有 `SET search_path = ''`
- [ ] 所有 SQL 都使用完整 schema 名稱（如 `public.users`）
- [ ] SECURITY DEFINER 函式有適當的權限檢查
- [ ] 所有 View 都有 `WITH (security_invoker = true)`
- [ ] `supabase db lint --level warning` 零警告
- [ ] 已設定適當的 GRANT 權限

---

## 最佳實踐總結

1. **search_path = ''**：所有函式都要設定，無例外
2. **完整 schema 名稱**：`public.table` 而非 `table`
3. **View security_invoker**：所有 View 都要設定 `true`
4. **db lint 零警告**：提交前必須通過檢查
5. **最小權限原則**：GRANT 只給需要的角色

---

## 延伸閱讀

- [PostgreSQL Function Security](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Supabase Functions](https://supabase.com/docs/guides/database/functions)
- 上一篇：[RLS 與「讀 Client，寫 Server」策略](/nuxt/supabase-rls-strategy/)
- 下一篇：[Self-hosted Supabase 部署與遷移](/nuxt/supabase-self-hosted/)
