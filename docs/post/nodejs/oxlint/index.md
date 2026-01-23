---
title: Oxlint + Oxfmt - 用 Rust 加速你的程式碼檢查與格式化
description: 使用 Oxlint 和 Oxfmt 取代 ESLint 和 Prettier，享受 50-100 倍的速度提升，同時保持程式碼品質。
datePublished: 2026-01-23
category: Node.js
tags:
  - Oxlint
  - Oxfmt
  - Node.js
  - Linter
  - Formatter
  - Rust
---

# Oxlint + Oxfmt - 用 Rust 加速你的程式碼檢查與格式化

## 這篇要解決什麼問題

ESLint 和 Prettier 是前端開發的標配工具，但隨著專案規模增長，它們的速度問題變得越來越明顯：

- 大型專案執行 `eslint .` 需要等待數秒甚至數十秒
- CI/CD 流程中 lint 步驟佔用大量時間
- pre-commit hooks 讓提交變得緩慢
- 開發者因為等待而跳過檢查

Oxlint 和 Oxfmt 是用 Rust 重寫的 linter 和 formatter，能夠帶來 **50-100 倍的速度提升**，讓程式碼檢查從「等待」變成「即時」。

---

## Oxlint 和 Oxfmt 是什麼

| 工具   | 對標     | 語言 | 特點                         |
| ------ | -------- | ---- | ---------------------------- |
| Oxlint | ESLint   | Rust | 快 50-100 倍，零配置即可使用 |
| Oxfmt  | Prettier | Rust | 快 35 倍，格式一致性高       |

這兩個工具都來自 [Oxc 專案](https://oxc.rs/)（Oxidation Compiler），目標是用 Rust 重寫前端工具鏈，提供極致的效能。

### 效能對比

以一個中型專案（約 500 個檔案）為例：

```
ESLint:   8.2 秒
Oxlint:   0.1 秒  (快 82 倍)

Prettier: 4.5 秒
Oxfmt:    0.12 秒 (快 37 倍)
```

---

## 準備環境

- Node.js v18 或以上版本
  > [參考文章](/nodejs/nvm/)
- pnpm 或其他套件管理工具
  > [參考文章](/nodejs/package-manager/)

---

## 安裝 Oxlint 和 Oxfmt

```bash
pnpm add -D oxlint oxfmt
```

安裝完成後，在 `package.json` 加入 scripts：

```json:line-numbers{3-6}
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "fmt": "oxfmt --write",
    "fmt:check": "oxfmt --check"
  }
}
```

現在可以執行：

```bash
# 檢查程式碼問題
pnpm lint

# 檢查並自動修復
pnpm lint:fix

# 格式化程式碼
pnpm fmt

# 檢查格式是否正確（不修改檔案）
pnpm fmt:check
```

---

## 設定 Oxlint

Oxlint 預設就能檢查大多數常見問題，但如果需要自訂規則，可以建立 `.oxlintrc.json`：

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "import", "unicorn"],
  "env": {
    "browser": true,
    "node": true,
    "es2024": true
  },
  "rules": {
    "eqeqeq": "error",
    "camelcase": "error",
    "no-await-in-loop": "error",
    "require-atomic-updates": "error",
    "max-nested-callbacks": ["warn", { "max": 3 }],
    "no-return-await": "error"
  },
  "ignorePatterns": ["node_modules", "dist", ".nuxt", "**/*.md"]
}
```

### 常用設定說明

| 設定             | 說明                                               |
| ---------------- | -------------------------------------------------- |
| `$schema`        | 提供 JSON Schema，讓編輯器能自動補全和驗證         |
| `plugins`        | 啟用額外的規則集（typescript、import、unicorn 等） |
| `env`            | 指定執行環境，讓 Oxlint 知道哪些全域變數是合法的   |
| `rules`          | 自訂規則，格式與 ESLint 相容                       |
| `ignorePatterns` | 忽略特定檔案或目錄                                 |

### 可用的 Plugins

```json
{
  "plugins": [
    "typescript", // TypeScript 相關規則
    "import", // import/export 規則
    "unicorn", // 現代 JavaScript 最佳實踐
    "react", // React 相關規則
    "jsx-a11y", // 無障礙規則
    "nextjs", // Next.js 規則
    "jsdoc", // JSDoc 規則
    "promise" // Promise 相關規則
  ]
}
```

---

## 設定 Oxfmt

Oxfmt 目前不支援設定檔，它會使用固定的格式化風格。這個設計是刻意的，目的是：

1. **零配置**：不需要討論格式化風格
2. **一致性**：所有專案使用相同格式
3. **簡單**：沒有設定就沒有爭議

如果你習慣 Prettier 的可設定性，這可能需要適應。但好處是團隊不再需要花時間討論「要不要用分號」或「縮排用 2 還是 4」。

---

## 整合 VS Code

### 安裝擴充套件

目前 Oxlint 提供官方 VS Code 擴充套件：

> [Oxc - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=nickstutzman.oxc-vscode)

安裝後，Oxlint 會在編輯器中即時顯示問題。

### 設定自動修復和格式化

在專案根目錄建立或更新 `.vscode/settings.json`：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "nickstutzman.oxc-vscode"
}
```

> 如果 Oxfmt 的 VS Code 整合尚未完善，可以暫時使用 Prettier 作為 formatter，只用 Oxlint 做檢查。

---

## 整合 Git Hooks

使用 Husky 在提交前自動執行檢查和格式化。

### 安裝 Husky

```bash
pnpm add -D husky
pnpm exec husky init
```

### 設定 pre-commit hook

編輯 `.husky/pre-commit`：

```bash
pnpm fmt
pnpm lint:fix
```

這樣每次 commit 時都會：

1. 先用 Oxfmt 格式化程式碼
2. 再用 Oxlint 檢查並自動修復問題

### 搭配 lint-staged（可選）

如果只想檢查有變更的檔案，可以使用 lint-staged：

```bash
pnpm add -D lint-staged
```

在 `package.json` 加入：

```json
{
  "lint-staged": {
    "*.{js,ts,vue,jsx,tsx}": ["oxlint --fix", "oxfmt --write"]
  }
}
```

修改 `.husky/pre-commit`：

```bash
pnpm lint-staged
```

---

## 從 ESLint + Prettier 遷移

### 遷移策略

**漸進式遷移**：先讓兩套工具並存，逐步替換。

1. 安裝 Oxlint 和 Oxfmt
2. 修改 scripts，新增 `ox-*` 指令
3. 測試確認輸出結果符合預期
4. 移除 ESLint 和 Prettier

### 完整遷移步驟

```bash
# 1. 安裝新工具
pnpm add -D oxlint oxfmt

# 2. 更新 package.json scripts
# 將 eslint 改為 oxlint，prettier 改為 oxfmt

# 3. 測試
pnpm lint
pnpm fmt

# 4. 確認沒問題後，移除舊工具
pnpm remove eslint prettier @antfu/eslint-config
# 以及其他 eslint-* 和 prettier-* 套件

# 5. 刪除舊設定檔
rm eslint.config.js .prettierrc
```

### 遷移後的 package.json

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "fmt": "oxfmt --write",
    "fmt:check": "oxfmt --check",
    "check": "pnpm fmt && pnpm lint"
  },
  "devDependencies": {
    "oxfmt": "^0.26.0",
    "oxlint": "^1.41.0"
  }
}
```

---

## 整合自動化流程

建議設定一個完整的檢查指令：

```json
{
  "scripts": {
    "check": "pnpm fmt && pnpm lint && pnpm typecheck && pnpm test",
    "fmt": "oxfmt --write",
    "lint": "oxlint --deny-warnings",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest run"
  }
}
```

### 流程說明

```
pnpm check
    │
    ▼
┌─────────────┐
│ 1. fmt      │ → Oxfmt：自動格式化程式碼
├─────────────┤
│ 2. lint     │ → Oxlint：檢查程式碼品質（--deny-warnings 將警告視為錯誤）
├─────────────┤
│ 3. typecheck│ → TypeScript：型別檢查
├─────────────┤
│ 4. test     │ → Vitest：執行測試
└─────────────┘
    │
    ▼
全部通過 → 可以提交
任一失敗 → 修復後重試
```

---

## 常見問題

### Q: Oxlint 支援所有 ESLint 規則嗎？

不完全支援。Oxlint 目前實作了約 500 條規則，涵蓋了最常用的規則，但一些冷門或特定框架的規則可能還沒支援。可以查看 [Oxlint Rules](https://oxc.rs/docs/guide/usage/linter/rules.html) 確認支援情況。

### Q: 可以同時使用 Oxlint 和 ESLint 嗎？

可以。你可以讓 Oxlint 處理它支援的規則，ESLint 處理剩下的。但這樣會失去速度優勢，建議最終完全遷移到 Oxlint。

### Q: Oxfmt 的格式化風格可以自訂嗎？

目前不行。Oxfmt 採用固定風格，這是刻意的設計決策。如果需要自訂格式化風格，目前只能繼續使用 Prettier 或 dprint。

### Q: Vue SFC 支援如何？

Oxlint 支援 Vue SFC 檔案的 `<script>` 和 `<script setup>` 區塊。Oxfmt 也支援 Vue 檔案的格式化。

### Q: 需要額外設定 TypeScript 嗎？

不需要。只要在 plugins 中啟用 `typescript`，Oxlint 就會自動處理 `.ts` 和 `.tsx` 檔案，不需要額外的 TypeScript 設定。

---

## 最佳實踐

1. **善用 `--deny-warnings`**：在 CI 中使用這個參數，確保所有警告都被處理
2. **搭配 Git Hooks**：在提交前自動執行檢查，避免問題程式碼進入 repository
3. **漸進式遷移**：如果現有專案已經使用 ESLint，不要一次全部切換，先並行運作一段時間
4. **定期更新**：Oxlint 和 Oxfmt 還在快速發展中，定期更新可以獲得更多規則和更好的效能
5. **統一團隊工具**：確保團隊所有成員使用相同版本的工具，避免格式化差異

---

## 總結

| 項目       | ESLint + Prettier | Oxlint + Oxfmt |
| ---------- | ----------------- | -------------- |
| 速度       | 慢                | 快 50-100 倍   |
| 配置複雜度 | 高                | 低             |
| 規則數量   | 多                | 夠用           |
| 生態系     | 成熟              | 發展中         |
| 學習曲線   | 陡峭              | 平緩           |

如果你的專案符合以下條件，強烈建議遷移：

- 專案規模中等以上（100+ 檔案）
- CI/CD 時間是瓶頸
- 團隊對格式化風格沒有特殊要求
- 願意接受部分規則暫時不可用

Oxlint 和 Oxfmt 代表了前端工具的未來方向：用 Rust 重寫效能敏感的工具，讓開發體驗更加流暢。

---

## 延伸閱讀

- [Oxc 官方文件](https://oxc.rs/)
- [Oxlint 規則列表](https://oxc.rs/docs/guide/usage/linter/rules.html)
- [從 ESLint 遷移指南](https://oxc.rs/docs/guide/usage/linter/migration.html)
