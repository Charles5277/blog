---
title: Nitro Server API 設計模式
description: 使用 Nitro 建構 RESTful API，涵蓋目錄結構、Zod 驗證、統一回應格式與錯誤處理。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - Nitro
  - Pinia
series: nuxt-fullstack
seriesTitle: Nuxt 4 全棧實戰筆記
seriesOrder: 9
---

## 這篇要解決什麼問題

Server API 是連接前端與資料庫的橋樑。設計良好的 API 需要考慮：

- RESTful API 的目錄結構設計
- Zod 請求驗證整合
- 統一回應格式（列表分頁、單筆資料、錯誤）
- 權限檢查與 createError 錯誤處理
- 操作日誌記錄

---

## RESTful 目錄結構

### 版本化 API

```
server/
├── api/
│   ├── v1/                       # 版本化業務 API
│   │   ├── resources/
│   │   │   ├── index.get.ts      # GET /api/v1/resources（列表）
│   │   │   ├── index.post.ts     # POST /api/v1/resources（新增）
│   │   │   └── [id]/
│   │   │       ├── index.get.ts      # GET /api/v1/resources/:id
│   │   │       ├── index.patch.ts    # PATCH /api/v1/resources/:id
│   │   │       └── index.delete.ts   # DELETE /api/v1/resources/:id
│   ├── auth/                     # 認證 API
│   └── admin/                    # 管理員 API
├── middleware/                   # Server middleware
├── routes/auth/                  # OAuth routes
└── utils/                        # 共用工具函式
```

### 路由命名規則

| 檔案名稱               | HTTP 方法 | 路徑                |
| ---------------------- | --------- | ------------------- |
| `index.get.ts`         | GET       | `/api/v1/users`     |
| `index.post.ts`        | POST      | `/api/v1/users`     |
| `[id]/index.get.ts`    | GET       | `/api/v1/users/:id` |
| `[id]/index.patch.ts`  | PATCH     | `/api/v1/users/:id` |
| `[id]/index.delete.ts` | DELETE    | `/api/v1/users/:id` |

### 為什麼使用 `[id]/index.*.ts` 而非 `[id].*.ts`

使用目錄結構 `[id]/index.*.ts` 而非扁平結構 `[id].*.ts`，可以：

1. **避免路由衝突**：同一目錄不會同時有 `[id].ts` 和 `[id]/xxx.ts`
2. **方便擴展**：未來可在 `[id]/` 目錄下新增子路由
3. **結構清晰**：每個資源的 CRUD 操作集中管理

---

## API 開發流程

### 標準流程（7 步驟）

每個 API 開發遵循以下順序：

```typescript
export default defineEventHandler(async (event) => {
  // 1. 權限檢查（最先執行）
  const { user } = await requireUserSession(event, {
    user: { role: ["admin", "manager", "staff"] },
  });

  // 2. 驗證請求資料（Query 或 Body）
  const body = await readValidatedBody(event, createResourceSchema.parse);

  // 3. 取得 Supabase Client
  const supabase = await getSupabaseWithContext(event);
  const db = supabase.schema("your_schema");

  // 4. 執行業務邏輯
  const { data, error } = await db
    .from("resources")
    .insert(body)
    .select()
    .single();

  // 5. 錯誤處理
  if (error) {
    throw createError({ statusCode: 500, message: "操作失敗" });
  }

  // 6. 記錄操作日誌（寫入操作）
  await db.from("operation_logs").insert({
    user_id: user.id,
    action: "create",
    target_type: "resource",
    target_id: data.id.toString(),
  });

  // 7. 回傳統一格式
  setResponseStatus(event, 201);
  return { data };
});
```

---

## Zod 請求驗證

### Schema 定義（放在 shared/types/）

```typescript
// shared/types/resources.ts
import { z } from "zod";

// 共用分頁查詢 Schema（可複用）
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(1000).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

// 新增資源 Schema
export const createResourceSchema = z.object({
  name: z.string().min(1, "名稱必填").max(200),
  description: z.string().max(500).nullable().optional(),
});

// 更新資源 Schema（所有欄位變成可選）
export const updateResourceSchema = createResourceSchema.partial();

// 路徑參數 Schema
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
```

### 在 API 中使用驗證

```typescript
// GET 請求：驗證 Query Parameters
const query = await getValidatedQuery(event, paginationQuerySchema.parse);

// POST/PATCH 請求：驗證 Request Body
const body = await readValidatedBody(event, createResourceSchema.parse);

// 路徑參數驗證
const params = await getValidatedRouterParams(event, idParamSchema.parse);
```

### 驗證失敗自動回應

使用 `getValidatedQuery` 和 `readValidatedBody` 時，驗證失敗會自動拋出 400 錯誤：

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "message": "名稱必填"
}
```

---

## 權限檢查

### requireUserSession 用法

```typescript
// 基本用法：僅檢查是否登入
const { user } = await requireUserSession(event);

// 指定允許的角色
const { user } = await requireUserSession(event, {
  user: { role: ["admin", "manager"] },
});

// 取得完整 session 資訊
const { user, session } = await requireUserSession(event);
```

### 角色檢查順序

| 角色           | 權限等級 | 可存取範圍          |
| -------------- | -------- | ------------------- |
| `admin`        | 最高     | 完整系統管理        |
| `manager`      | 高       | 部門管理、資料 CRUD |
| `staff`        | 中       | 基本資料讀取        |
| `unauthorized` | 最低     | 無權限（等待授權）  |

---

## 統一回應格式

### 列表回應（含分頁）

```typescript
interface ListResponse&lt;T&gt; {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 實作範例
return {
  data: resources,
  pagination: {
    page: query.page,
    pageSize: query.pageSize,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / query.pageSize),
  },
}
```

### 單筆回應

```typescript
interface SingleResponse&lt;T&gt; {
  data: T
}

// 新增操作：設定 201 狀態碼
setResponseStatus(event, 201)
return { data: newResource }

// 查詢/更新操作
return { data: resource }
```

### 刪除回應

```typescript
interface DeleteResponse {
  data: {
    id: number;
    deleted_at: string | null; // 軟刪除時間
    hard_deleted: boolean; // 是否永久刪除
  };
}
```

---

## 錯誤處理

### 錯誤類型與狀態碼

| 狀態碼 | 使用情境                        |
| ------ | ------------------------------- |
| 400    | 請求格式錯誤、驗證失敗          |
| 401    | 未認證（未登入）                |
| 403    | 無權限（已登入但權限不足）      |
| 404    | 資源不存在                      |
| 409    | 資源衝突（如重複的 unique key） |
| 500    | 伺服器內部錯誤                  |

### createError 用法

```typescript
// 400 Bad Request
throw createError({
  statusCode: 400,
  statusMessage: "Bad Request",
  message: "缺少必要參數",
});

// 404 Not Found
if (!data) {
  throw createError({
    statusCode: 404,
    message: "找不到指定的資源",
  });
}

// 409 Conflict（唯一約束違反）
if (error?.code === "23505") {
  throw createError({
    statusCode: 409,
    message: "資料重複，請檢查輸入",
  });
}

// 500 Internal Server Error
if (error) {
  console.error("Database error:", error);
  throw createError({
    statusCode: 500,
    message: "操作失敗，請稍後再試",
  });
}
```

---

## 搜尋與排序

### 搜尋實作

```typescript
// 多欄位搜尋（使用 OR 條件）
if (query.search) {
  const searchStr = `%${query.search}%`;
  dbQuery = dbQuery.or(
    `name.ilike.${searchStr},description.ilike.${searchStr}`,
  );
}
```

### 排序實作

```typescript
// 動態排序
const sortDirAsc = query.sortDir === "asc";
dbQuery = dbQuery.order(query.sortBy || "id", { ascending: sortDirAsc });
```

### 分頁實作

```typescript
// 計算 range
const from = (query.page - 1) * query.pageSize;
const to = from + query.pageSize - 1;

// 執行分頁查詢
const { data, count, error } = await dbQuery
  .select("*", { count: "exact" })
  .range(from, to);
```

---

## 完整 API 範例

### GET 列表 API

```typescript
// server/api/v1/resources/index.get.ts
import { getSupabaseWithContext } from "~~/server/utils/supabase";
import { paginationQuerySchema } from "~~/shared/types/resources";

export default defineEventHandler(async (event) => {
  // 1. 權限檢查
  await requireUserSession(event);

  // 2. 驗證查詢參數
  const query = await getValidatedQuery(event, paginationQuerySchema.parse);

  // 3. 取得 Supabase Client
  const supabase = await getSupabaseWithContext(event);
  const db = supabase.schema("your_schema");

  // 4. 建立查詢
  let dbQuery = db
    .from("resources")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  // 5. 搜尋條件
  if (query.search) {
    const searchStr = `%${query.search}%`;
    dbQuery = dbQuery.or(`name.ilike.${searchStr}`);
  }

  // 6. 排序
  dbQuery = dbQuery.order(query.sortBy || "id", {
    ascending: query.sortDir === "asc",
  });

  // 7. 分頁
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;
  const { data, count, error } = await dbQuery.range(from, to);

  // 8. 錯誤處理
  if (error) {
    throw createError({ statusCode: 500, message: "載入資料失敗" });
  }

  // 9. 回應
  return {
    data: data || [],
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / query.pageSize),
    },
  };
});
```

### POST 新增 API

```typescript
// server/api/v1/resources/index.post.ts
import { getSupabaseWithContext } from "~~/server/utils/supabase";
import { createResourceSchema } from "~~/shared/types/resources";

export default defineEventHandler(async (event) => {
  // 1. 權限檢查
  const { user } = await requireUserSession(event, {
    user: { role: ["admin", "manager"] },
  });

  // 2. 驗證請求資料
  const body = await readValidatedBody(event, createResourceSchema.parse);

  // 3. 取得 Supabase Client
  const supabase = await getSupabaseWithContext(event);
  const db = supabase.schema("your_schema");

  // 4. 新增資料
  const { data, error } = await db
    .from("resources")
    .insert({ ...body, created_by: user.id })
    .select()
    .single();

  // 5. 錯誤處理
  if (error?.code === "23505") {
    throw createError({ statusCode: 409, message: "資料重複" });
  }
  if (error) {
    throw createError({ statusCode: 500, message: "新增失敗" });
  }

  // 6. 記錄操作日誌
  await db.from("operation_logs").insert({
    user_id: user.id,
    action: "create",
    target_type: "resource",
    target_id: data.id.toString(),
    details: body,
  });

  // 7. 回應
  setResponseStatus(event, 201);
  return { data };
});
```

### PATCH 更新 API

```typescript
// server/api/v1/resources/[id]/index.patch.ts
import { getSupabaseWithContext } from "~~/server/utils/supabase";
import { updateResourceSchema, idParamSchema } from "~~/shared/types/resources";

export default defineEventHandler(async (event) => {
  // 1. 權限檢查
  const { user } = await requireUserSession(event, {
    user: { role: ["admin", "manager"] },
  });

  // 2. 驗證參數與請求資料
  const params = await getValidatedRouterParams(event, idParamSchema.parse);
  const body = await readValidatedBody(event, updateResourceSchema.parse);

  // 3. 取得 Supabase Client
  const supabase = await getSupabaseWithContext(event);
  const db = supabase.schema("your_schema");

  // 4. 更新資料
  const { data, error } = await db
    .from("resources")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .is("deleted_at", null)
    .select()
    .single();

  // 5. 錯誤處理
  if (!data) {
    throw createError({ statusCode: 404, message: "找不到指定的資源" });
  }
  if (error) {
    throw createError({ statusCode: 500, message: "更新失敗" });
  }

  // 6. 記錄操作日誌
  await db.from("operation_logs").insert({
    user_id: user.id,
    action: "update",
    target_type: "resource",
    target_id: params.id.toString(),
    details: body,
  });

  // 7. 回應
  return { data };
});
```

---

## 踩坑經驗

### 路由衝突的陷阱

**問題**：API 回傳 HTML 而非 JSON。

**原因**：同一目錄下同時有 `[id].ts` 和 `[id]/xxx.ts`。

```
❌ 錯誤結構
server/api/v1/users/
├── [id].ts         # 處理所有方法
└── [id]/
    └── roles.ts    # 子路由

✅ 正確結構
server/api/v1/users/
└── [id]/
    ├── index.get.ts
    ├── index.patch.ts
    ├── index.delete.ts
    └── roles.get.ts
```

### Query 參數類型轉換

**問題**：`page` 參數應該是數字，但 Query 參數預設都是字串。

**解決**：使用 `z.coerce.number()` 自動轉換。

```typescript
// ❌ 錯誤：不會自動轉換
z.number(); // '1' 會驗證失敗

// ✅ 正確：自動將字串轉為數字
z.coerce.number().int().positive(); // '1' → 1
```

### 忘記過濾軟刪除資料

**問題**：列表顯示已刪除的資料。

**解決**：所有查詢都加上 `.is('deleted_at', null)`。

```typescript
// ✅ 正確：排除已軟刪除的資料
const { data } = await db.from("resources").select("*").is("deleted_at", null); // 必須加這行
```

---

## 檢查清單

建立新 API 時，確認以下項目：

- [ ] 使用正確的目錄結構（`[id]/index.*.ts`）
- [ ] 在 `shared/types/` 定義 Zod Schema
- [ ] 在最開頭進行權限檢查（`requireUserSession`）
- [ ] 使用 `getValidatedQuery` 或 `readValidatedBody` 驗證輸入
- [ ] 查詢時過濾軟刪除（`.is('deleted_at', null)`）
- [ ] 正確處理錯誤（404、409、500）
- [ ] 回傳統一格式（`{ data, pagination? }`）
- [ ] 新增操作設定 201 狀態碼
- [ ] 異動操作記錄操作日誌

---

## 最佳實踐總結

1. **版本化 API**：使用 `/api/v1/` 前綴
2. **目錄結構**：使用 `[id]/index.*.ts` 避免路由衝突
3. **Zod 驗證**：所有輸入都要驗證，Schema 放 `shared/types/`
4. **權限優先**：`requireUserSession` 放在最前面
5. **統一回應**：列表用 `{ data, pagination }`，單筆用 `{ data }`
6. **語意化錯誤**：使用適當的 HTTP 狀態碼
7. **操作日誌**：所有 CUD 操作都要記錄

---

## 延伸閱讀

- [Nitro 文件](https://nitro.unjs.io/)
- [h3 驗證 API](https://h3.unjs.io/utils/request#validating-with-validation-libraries)
- 上一篇：[Database Function 安全規範](/nuxt/supabase-function-security/)
- 下一篇：[Pinia Colada 非同步狀態管理](/nuxt/pinia-colada-async-state/)
