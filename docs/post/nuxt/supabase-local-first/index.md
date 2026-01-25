---
title: Supabase Local-First 開發流程
description: 建立安全可靠的 Supabase Migration 工作流程，從本地開發到遠端同步的完整指南。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - Supabase
  - PostgreSQL
series: nuxt-fullstack
seriesTitle: Nuxt 4 全棧實戰筆記
seriesOrder: 6
---

## 這篇要解決什麼問題

資料庫 Schema 變更是最容易出錯的環節。這篇文章將說明：

- 為什麼堅持 Local → Test → Push 流程
- Migration 的建立與管理
- 為什麼禁止直接在 GUI 改 Schema
- 完整的 Supabase CLI 命令流程

---

## 核心原則

### Local-First 開發流程

```
┌─────────────────────────────────────────────────────────────┐
│                      1. 本地開發                             │
├─────────────────────────────────────────────────────────────┤
│  supabase migration new add_users_table                     │
│  → 編輯 SQL 檔案                                            │
│  → supabase db reset（套用到本地）                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      2. 安全檢查                             │
├─────────────────────────────────────────────────────────────┤
│  supabase db lint --level warning                           │
│  → 必須零警告                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      3. 類型同步                             │
├─────────────────────────────────────────────────────────────┤
│  supabase gen types typescript --local                       │
│  → 更新 app/types/database.types.ts                          │
│  → pnpm typecheck                                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      4. 提交與推送                           │
├─────────────────────────────────────────────────────────────┤
│  git commit → git push                                       │
│  → CI 執行 supabase db push                                  │
└─────────────────────────────────────────────────────────────┘
```

### 為什麼不能直接改遠端？

| 問題       | 後果                     |
| ---------- | ------------------------ |
| 無版本控制 | 無法追蹤誰改了什麼       |
| 無法復原   | 出錯時難以回滾           |
| 環境不一致 | 本地與遠端 Schema 不同步 |
| 測試困難   | 直接在正式環境測試       |

---

## Migration 工作流程

### 標準開發流程

```bash
# 1. 建立新 migration
supabase migration new add_users_table

# 2. 編輯 migration SQL（保持單一主題）
# supabase/migrations/20240101000000_add_users_table.sql

# 3. 套用到本機測試
supabase db reset

# 4. 安全檢查
supabase db lint --level warning

# 5. 重新產生 TypeScript types
supabase gen types typescript --local | tee app/types/database.types.ts > /dev/null

# 6. 執行測試驗證
pnpm typecheck
```

### Migration 檔案範例

```sql
-- supabase/migrations/20240101000000_add_users_table.sql

-- 建立表格
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  role text NOT NULL DEFAULT 'staff',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 建立 RLS Policy
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- 建立索引
CREATE INDEX users_email_idx ON public.users (email);
```

### 單一主題原則

每個 Migration 只做一件事：

```bash
# ✅ 好的命名（單一主題）
supabase migration new create_users_table
supabase migration new add_users_role_column
supabase migration new create_users_rls_policies

# ❌ 不好的命名（混合多個主題）
supabase migration new update_users_and_add_posts_and_fix_policies
```

---

## 命名規則

| 項目      | 規則            | 範例                    |
| --------- | --------------- | ----------------------- |
| 表名      | snake_case 複數 | `users`, `tool_inserts` |
| 欄位      | snake_case      | `created_at`, `user_id` |
| 函式      | snake_case      | `get_user_role`         |
| Enum      | snake_case      | `user_role`             |
| Migration | snake_case 描述 | `add_users_table`       |

---

## GUI 使用準則

### 什麼可以用 GUI

| 功能            | 可否使用 | 備註                              |
| --------------- | -------- | --------------------------------- |
| 查看資料        | ✅       | 無需額外動作                      |
| 查看 RLS Policy | ✅       | 方便除錯                          |
| 快速 PoC        | ⚠️       | 用完必須 `db diff` 產出 migration |
| 建立函式        | ❌       | 無法控制 `search_path`            |
| 直接匯入 SQL    | ❌       | 可能與 Repo 不同步                |

### GUI 變更後的處理

如果在 Supabase Studio 做了變更：

```bash
# 產生 diff 並存為 migration
supabase db diff --use-migra -f from_gui

# 檢視產生的 SQL
cat supabase/migrations/*_from_gui.sql

# 繼續標準流程
supabase db reset
supabase db lint --level warning
```

---

## 遠端同步

### 推送 Migration

```bash
# 手動推送（通常由 CI 執行）
supabase db push

# 檢視遠端 migration 狀態
supabase migration list --linked
```

::: tip Self-hosted 環境
如果使用 Self-hosted Supabase，CI 無法直接執行 `supabase db push`。
請參考 [Self-hosted Supabase 部署與遷移](/nuxt/supabase-self-hosted/) 了解手動執行 migration 的方式。
:::

### 處理不一致

```bash
# 標記某個 migration 為已棄用
supabase migration repair --status reverted 20240101000000

# 重建遠端（⚠️ 會清除資料）
supabase db reset --linked
```

---

## 常用命令速查

```bash
# 啟動本地 Supabase
supabase start

# 停止本地 Supabase
supabase stop

# 重置資料庫（套用所有 migration）
supabase db reset

# 安全檢查
supabase db lint --level warning

# 產生類型
supabase gen types typescript --local | tee app/types/database.types.ts > /dev/null

# 建立新 migration
supabase migration new <description>

# 從 GUI 變更產生 diff
supabase db diff --use-migra -f <name>

# 推送到遠端
supabase db push

# 檢視遠端狀態
supabase migration list --linked
```

---

## 踩坑經驗

### GUI 改 Schema 的同步災難

**問題**：在 Supabase Studio 新增欄位，但本地沒有對應的 migration。

**後果**：

- 本地 `db reset` 後欄位消失
- 其他開發者環境不一致
- TypeScript 類型與實際 Schema 不同步

**解決**：所有變更都從 Migration 開始，GUI 只用來觀察。

### Sequence 不同步

**問題**：資料匯入後，新增資料出現 `duplicate key` 錯誤。

**原因**：使用 `INSERT ... (id, ...)` 指定 ID 時，sequence 不會自動更新。

**解決**：

```sql
-- 重設 sequence 為 max(id) + 1
SELECT setval(
  'public.users_id_seq',
  (SELECT COALESCE(MAX(id), 0) + 1 FROM public.users),
  false
);
```

### Migration 不一致

**問題**：`schema_migrations` 表與本地 migration 檔案不一致。

**解決**：

```bash
# 檢視差異
supabase migration list --linked

# 標記問題 migration
supabase migration repair --status reverted <timestamp>
```

---

## Pre-commit Checklist

在提交 Migration 前確認：

- [ ] `supabase db reset` 能順利重建
- [ ] `supabase db lint --level warning` 無錯誤
- [ ] 新增函式皆 `SET search_path = ''`
- [ ] 新增 View 皆設定 `security_invoker = true`
- [ ] TypeScript types 已更新
- [ ] 相關文件已同步更新

---

## 最佳實踐總結

1. **本地優先**：所有變更先在本地測試
2. **單一主題**：每個 migration 只做一件事
3. **自動化檢查**：`db lint` 必須零警告
4. **類型同步**：每次 migration 後重新產生 types
5. **版本控制**：Migration 檔案必須 commit 到 Git

---

## 延伸閱讀

- [Supabase CLI 文件](https://supabase.com/docs/guides/cli)
- [Supabase Migration 指南](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- **進階**：[Self-hosted Supabase 部署與遷移](/nuxt/supabase-self-hosted/)
- 上一篇：[角色權限系統設計](/nuxt/role-based-access-control/)
- 下一篇：[RLS 與「讀 Client，寫 Server」策略](/nuxt/supabase-rls-strategy/)
