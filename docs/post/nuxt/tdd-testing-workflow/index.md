---
title: TDD 與自動化測試
description: 在 Nuxt 4 專案中實踐 TDD 開發流程，涵蓋 Vitest 設定、單元測試與 Nuxt 環境測試。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - TDD
  - Vitest
series: nuxt-fullstack
seriesTitle: Nuxt 4 全棧實戰筆記
seriesOrder: 11
---

## 這篇要解決什麼問題

測試是確保程式碼品質的關鍵，但很多團隊只把測試當作「有空再補」的事。這篇文章將說明：

- Red → Green → Refactor 的實際操作
- Vitest + @nuxt/test-utils 設定
- 單元測試 vs Nuxt 環境測試的區分
- `pnpm check` 一鍵檢查流程
- 測試的 Do's and Don'ts

---

## TDD 核心理念

### 為什麼要先寫測試？

| 傳統開發           | TDD 開發       |
| ------------------ | -------------- |
| 寫完程式碼再補測試 | 先寫測試再實作 |
| 測試變成負擔       | 測試驅動設計   |
| 「測試是選項」     | 「測試是必須」 |
| 容易遺漏邊界案例   | 先思考邊界案例 |

### Red → Green → Refactor

```
┌─────────────────────────────────────────────┐
│  1. Red: 先寫測試，執行確認失敗              │
│     - 定義預期行為                          │
│     - 測試必須失敗（確認測試有效）           │
│     ↓                                       │
│  2. Green: 寫最小實作，讓測試通過            │
│     - 只寫剛好讓測試通過的程式碼             │
│     - 不要提前優化                          │
│     ↓                                       │
│  3. Refactor: 重構程式碼，保持測試通過       │
│     - 清理程式碼                            │
│     - 抽取重複邏輯                          │
│     - 測試必須保持綠燈                       │
│     ↓                                       │
│  4. 回到 1，處理下一個需求                   │
└─────────────────────────────────────────────┘
```

---

## TDD 實戰範例

### 需求：格式化價格函式

**Step 1: Red - 先寫測試**

```typescript
// test/unit/utils/formatPrice.test.ts
import { describe, it, expect } from "vitest";
import { formatPrice } from "~/utils/formatPrice";

describe("formatPrice", () => {
  it("should format positive number", () => {
    expect(formatPrice(1000)).toBe("$1,000");
  });

  it("should format zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("should format decimal number", () => {
    expect(formatPrice(1234.56)).toBe("$1,234.56");
  });

  it("should handle negative number", () => {
    expect(formatPrice(-500)).toBe("-$500");
  });
});
```

執行測試：

```bash
pnpm vitest run test/unit/utils/formatPrice.test.ts
# ❌ 失敗：formatPrice 還不存在
```

**Step 2: Green - 最小實作**

```typescript
// app/utils/formatPrice.ts
export function formatPrice(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = absValue.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-$${formatted}` : `$${formatted}`;
}
```

執行測試：

```bash
pnpm vitest run test/unit/utils/formatPrice.test.ts
# ✅ 通過
```

**Step 3: Refactor - 重構（如需要）**

程式碼已經足夠簡潔，暫不需要重構。如果有更多需求，繼續循環。

---

## 測試目錄結構

```
test/
├── unit/                   # 單元測試（Node 環境，快速）
│   ├── utils/
│   │   └── formatPrice.test.ts
│   ├── composables/
│   │   └── useCounter.test.ts
│   └── services/
│       └── validator.test.ts
├── nuxt/                   # Nuxt 環境測試（完整 Nuxt 功能）
│   └── components/
│       └── UserCard.nuxt.test.ts
└── helpers/                # 測試輔助函式
    ├── mockUser.ts
    └── mockSupabase.ts
```

### 單元測試 vs Nuxt 環境測試

| 類型      | 檔案命名         | 環境 | 速度 | 用途                       |
| --------- | ---------------- | ---- | ---- | -------------------------- |
| 單元測試  | `*.test.ts`      | Node | 快   | 純函式、utils、services    |
| Nuxt 測試 | `*.nuxt.test.ts` | Nuxt | 慢   | 元件、composables、plugins |

### 選擇原則

```
需要測試的程式碼
       │
       ▼
需要 Vue/Nuxt 功能嗎？
（如 ref、computed、useRoute、useSupabaseClient）
       │
  ┌────┴────┐
  │         │
 是        否
  │         │
  ▼         ▼
Nuxt 測試   單元測試
*.nuxt.test.ts  *.test.ts
```

---

## Vitest 設定

### 專案設定

Nuxt 4 整合了 Vitest，使用 `@nuxt/test-utils` 提供完整的測試支援。

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    "@nuxt/test-utils/module", // 加入測試模組
  ],
});
```

### package.json scripts

```json
{
  "scripts": {
    "test": "vitest run --coverage",
    "test:unit": "vitest run test/unit",
    "test:watch": "vitest watch"
  }
}
```

---

## 單元測試範例

### 測試純函式

```typescript
// test/unit/utils/parseDate.test.ts
import { describe, it, expect } from "vitest";
import { parseDate, formatDate } from "~/utils/date";

describe("parseDate", () => {
  it("should parse ISO string", () => {
    const result = parseDate("2024-01-15T10:30:00Z");
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0); // 0-indexed
    expect(result.getDate()).toBe(15);
  });

  it("should return null for invalid date", () => {
    expect(parseDate("invalid")).toBeNull();
  });
});

describe("formatDate", () => {
  it("should format date to YYYY-MM-DD", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("2024-01-15");
  });
});
```

### 測試 Zod Schema

```typescript
// test/unit/schemas/user.test.ts
import { describe, it, expect } from "vitest";
import { createUserSchema } from "~/schemas/user";

describe("createUserSchema", () => {
  it("should validate valid input", () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      role: "staff",
    };

    const result = createUserSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const input = {
      name: "John Doe",
      email: "invalid-email",
      role: "staff",
    };

    const result = createUserSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("should reject empty name", () => {
    const input = {
      name: "",
      email: "john@example.com",
      role: "staff",
    };

    const result = createUserSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
```

---

## Nuxt 環境測試範例

### 測試 Composable

```typescript
// test/nuxt/composables/useCounter.nuxt.test.ts
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { useCounter } from "~/composables/useCounter";

describe("useCounter", () => {
  it("should initialize with default value", async () => {
    const wrapper = await mountSuspended({
      setup() {
        const { count } = useCounter();
        return { count };
      },
      template: "<div>{{ count }}</div>",
    });

    expect(wrapper.text()).toBe("0");
  });

  it("should increment count", async () => {
    const wrapper = await mountSuspended({
      setup() {
        const { count, increment } = useCounter();
        return { count, increment };
      },
      template: '<button @click="increment">{{ count }}</button>',
    });

    await wrapper.trigger("click");
    expect(wrapper.text()).toBe("1");
  });
});
```

### 測試元件

```typescript
// test/nuxt/components/UserCard.nuxt.test.ts
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import UserCard from "~/components/UserCard.vue";

describe("UserCard", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  };

  it("should render user name", async () => {
    const wrapper = await mountSuspended(UserCard, {
      props: { user: mockUser },
    });

    expect(wrapper.text()).toContain("John Doe");
  });

  it("should emit edit event on button click", async () => {
    const wrapper = await mountSuspended(UserCard, {
      props: { user: mockUser },
    });

    await wrapper.find('[data-testid="edit-button"]').trigger("click");
    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("edit")![0]).toEqual([mockUser.id]);
  });
});
```

---

## Mock 技巧

### Mock 外部依賴

```typescript
// test/unit/services/api.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock $fetch
vi.mock("#app", () => ({
  $fetch: vi.fn(),
}));

import { $fetch } from "#app";
import { fetchUsers } from "~/services/api";

describe("fetchUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return users from API", async () => {
    const mockUsers = [{ id: "1", name: "John" }];
    vi.mocked($fetch).mockResolvedValue({ data: mockUsers });

    const result = await fetchUsers();
    expect(result).toEqual(mockUsers);
  });

  it("should handle API error", async () => {
    vi.mocked($fetch).mockRejectedValue(new Error("Network error"));

    await expect(fetchUsers()).rejects.toThrow("Network error");
  });
});
```

### Mock Supabase

```typescript
// test/helpers/mockSupabase.ts
export function createMockSupabase() {
  return {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };
}

// 使用
const mockSupabase = createMockSupabase();
mockSupabase.single.mockResolvedValue({ data: mockUser, error: null });
```

---

## pnpm check 自動化流程

### 完整檢查流程

```json
{
  "scripts": {
    "check": "pnpm format && pnpm lint && pnpm typecheck && pnpm test",
    "format": "oxfmt .",
    "lint": "oxlint --deny-warnings .",
    "typecheck": "nuxt typecheck",
    "test": "vitest run --coverage"
  }
}
```

### 流程圖

```
pnpm check
    │
    ▼
┌─────────────┐
│ 1. format   │ → oxfmt：自動修復格式問題
├─────────────┤
│ 2. lint     │ → oxlint：檢查程式碼品質
├─────────────┤
│ 3. typecheck│ → nuxt typecheck：TypeScript 類型檢查
├─────────────┤
│ 4. test     │ → vitest：執行所有測試 + coverage
└─────────────┘
    │
    ▼
全部通過 → 可以 commit
任一失敗 → 修復後重試
```

### Git Hooks 整合

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["oxlint --fix", "oxfmt"]
  }
}
```

---

## 測試覆蓋率

### 設定覆蓋率報告

```typescript
// vitest.config.ts（如果有的話）或 nuxt.config.ts
export default defineNuxtConfig({
  // ...
  vitest: {
    coverage: {
      reporter: ["text", "html"],
      include: ["app/**/*.ts", "server/**/*.ts"],
      exclude: ["**/*.d.ts", "**/types/**"],
    },
  },
});
```

### 覆蓋率目標

| 類型          | 建議覆蓋率 | 說明             |
| ------------- | ---------- | ---------------- |
| Utils/Helpers | 90%+       | 純函式應該高覆蓋 |
| Services      | 80%+       | 業務邏輯核心     |
| Composables   | 70%+       | 視複雜度調整     |
| Components    | 60%+       | 重點測試互動邏輯 |

---

## 踩坑經驗

### 測試環境與生產環境行為不一致

**問題**：測試通過但生產環境出錯。

**原因**：

1. Mock 行為與實際不同
2. 測試環境缺少某些全域設定
3. 時區或語系差異

**解決**：

```typescript
// 確保 Mock 行為與實際一致
vi.mocked($fetch).mockImplementation(async (url, options) => {
  // 模擬真實的錯誤回應格式
  if (url === "/api/v1/users") {
    throw createError({
      statusCode: 401,
      message: "未授權",
    });
  }
});
```

### 非同步測試超時

**問題**：測試偶爾超時失敗。

**解決**：

```typescript
// 設定適當的超時時間
it(
  "should fetch data",
  async () => {
    // ...
  },
  { timeout: 10000 },
); // 10 秒超時

// 或全域設定
// vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 10000,
  },
});
```

### 測試相互影響

**問題**：測試單獨跑通過，一起跑失敗。

**原因**：測試之間共享狀態。

**解決**：

```typescript
import { beforeEach, afterEach } from "vitest";

beforeEach(() => {
  // 每個測試前重置狀態
  vi.clearAllMocks();
});

afterEach(() => {
  // 每個測試後清理
  vi.restoreAllMocks();
});
```

---

## 測試 Do's and Don'ts

### ✅ Do's

```typescript
// 1. 測試行為，而非實作細節
it("should display error message when login fails", () => {
  // 測試使用者看到的結果
});

// 2. 使用有意義的測試名稱
it("should return empty array when no users match filter", () => {});

// 3. 每個測試只測試一件事
it("should validate email format", () => {
  expect(validateEmail("invalid")).toBe(false);
});

it("should accept valid email", () => {
  expect(validateEmail("test@example.com")).toBe(true);
});

// 4. 測試邊界案例
describe("pagination", () => {
  it("should handle empty data", () => {});
  it("should handle single page", () => {});
  it("should handle last page", () => {});
});
```

### ❌ Don'ts

```typescript
// 1. 不要測試框架本身
it("should render component", () => {
  // Vue 會渲染元件，不需要測試這個
});

// 2. 不要測試私有方法
// 私有方法會透過公開方法被測試到

// 3. 不要過度 mock
// Mock 太多會讓測試失去意義

// 4. 不要忽略測試
it.skip("should work", () => {}); // ❌ 禁止
```

---

## 檢查清單

每次實作功能時確認：

- [ ] 先寫測試（Red）
- [ ] 測試失敗訊息清楚
- [ ] 最小實作讓測試通過（Green）
- [ ] 重構後測試仍通過
- [ ] 涵蓋成功、失敗、邊界案例
- [ ] 無 `it.skip` 或 `describe.skip`
- [ ] `pnpm check` 通過

---

## 最佳實踐總結

1. **先寫測試**：TDD 不是「之後補測試」
2. **測試關鍵邏輯**：不需要 100% coverage，但核心邏輯必須測試
3. **快速回饋**：純函式用單元測試（Node 環境），速度更快
4. **自動化檢查**：`pnpm check` 整合 format、lint、typecheck、test
5. **持續綠燈**：測試失敗時立即修復，不要累積
6. **禁止跳過測試**：`it.skip` 代表技術債

---

## 延伸閱讀

- [Vitest 文件](https://vitest.dev/)
- [@nuxt/test-utils 文件](https://nuxt.com/docs/getting-started/testing)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- 上一篇：[Pinia Colada 非同步狀態管理](/nuxt/pinia-colada-async-state/)
- 下一篇：[AI 輔助開發與 CLAUDE.md](/nuxt/ai-assisted-claude-md/)
