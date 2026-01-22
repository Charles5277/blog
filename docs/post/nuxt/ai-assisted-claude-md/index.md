---
title: AI 輔助開發與 CLAUDE.md
description: 設計 CLAUDE.md 專案規範，建立 AI Skills 系統與自動化開發流程，提升與 AI 協作的效率。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - TDD
  - Vitest
  - AI
---

# AI 輔助開發與 CLAUDE.md

> 系列文章：Nuxt 4 全棧實戰（12/12）

## 這篇要解決什麼問題

AI 已經成為開發流程的重要夥伴，但 AI 不是萬能的。要讓 AI 真正幫上忙，你需要：

- 清楚的專案規範（CLAUDE.md）
- 結構化的知識系統（AI Skills）
- 自動化的開發流程
- 明確的協作界線

這篇文章將分享如何讓 AI 成為有效的開發夥伴。

---

## CLAUDE.md 設計理念

### 為什麼需要 CLAUDE.md

CLAUDE.md 是專案的「AI 使用手冊」，告訴 AI：

1. 專案使用的技術棧與規範
2. 開發流程與最佳實踐
3. 禁止事項與常見陷阱
4. 語言偏好與溝通方式

沒有 CLAUDE.md，AI 會：

- 使用自己的預設風格
- 不知道專案的特殊規範
- 可能踩到已知的坑

### 結構設計原則

好的 CLAUDE.md 應該：

1. **有目錄導覽**：方便定位重要章節
2. **分優先等級**：標記必讀 vs 參考
3. **簡潔明確**：AI 的 context 有限
4. **提供範例**：示範正確的寫法

```markdown
## 📑 目錄導覽

| 章節                      | 說明          | 重要性  |
| ------------------------- | ------------- | ------- |
| 語言偏好                  | 繁體中文規範  | 🔴 必讀 |
| Standards                 | 核心技術規範  | 🔴 必讀 |
| Development Workflow      | TDD 開發流程  | 🔴 必讀 |
| Database Guidelines       | Supabase 規範 | 🔴 必讀 |
| Vue Component Conventions | 元件撰寫規範  | 🟡 參考 |
| Git Commit Conventions    | Commit 格式   | 🟡 參考 |
```

### CLAUDE.md 核心章節

#### 1. 語言偏好

```markdown
## 🗣️ 語言偏好

> Claude 必須**一律使用繁體中文（Traditional Chinese, zh-TW）**
> **絕對禁止使用簡體中文（Simplified Chinese, zh-CN）**
```

#### 2. Standards（必讀）

```markdown
## ⚠️ Standards

**MUST FOLLOW THESE RULES, NO EXCEPTIONS**

### Core Technologies

- **Stack**: Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Nuxt UI
- **Patterns**: ALWAYS use Composition API + `<script setup>`
- **Type Safety**: prefer `interface` over `type`

### Code Style

- **Styling**: ALWAYS use TailwindCSS, NEVER manual CSS
- **Colors**: DO NOT hard code colors
- **Exports**: ALWAYS prefer named exports

### Development Environment

- **Dev Server**: NEVER launch it yourself
- **TDD**: 先寫測試，再實作
```

#### 3. Development Workflow

```markdown
## 🔄 Development Workflow

### Workflow Steps

1. **Plan**: 規劃任務，與使用者確認
2. **Design**: 設計測試案例
3. **Red**: 先寫失敗的測試
4. **Green**: 寫最小實作讓測試通過
5. **Refactor**: 重構，保持綠燈
6. **Stage**: 測試全部通過後才 git add
7. **Review**: 分析是否需要更多測試
```

#### 4. Database Guidelines

```markdown
## 🗄️ Database Guidelines

### 認證架構 - CRITICAL

// ❌ FORBIDDEN
const user = useSupabaseUser()

// ✅ CORRECT
const { user, loggedIn } = useUserSession()

### Migration Rules

- 所有 migration 必須先在本地建立
- 禁止用 GUI 直接改 schema
- 禁止手動建立 .sql 檔案

### Function Security

// ✅ 必須設定 search_path = ''
SET search_path = ''
```

---

## AI Skills 系統

### 為什麼需要 Skills

CLAUDE.md 適合放通用規範，但特定技術的詳細知識（如 Nuxt UI 的 125+ 元件）放在 CLAUDE.md 會太長。

AI Skills 解決這個問題：

- **按需載入**：只在需要時載入相關知識
- **模組化**：每個 skill 專注一個領域
- **可更新**：技術 skills 可自動同步最新版本

### 技術 Skills（自動更新）

透過 [nuxt-skills](https://github.com/onmax/nuxt-skills) 自動維護：

```
.claude/skills/
├── nuxt/                 # Nuxt 4 框架
│   ├── SKILL.md
│   └── references/
├── nuxt-ui/              # Nuxt UI 4 元件
│   ├── SKILL.md
│   ├── references/
│   └── components/       # 125+ 元件說明
├── vue/                  # Vue 3 Composition API
├── vueuse/               # VueUse composables
├── reka-ui/              # Headless UI 元件
└── ...
```

| Skill              | 用途                  |
| ------------------ | --------------------- |
| `nuxt`             | Nuxt 4 框架開發       |
| `nuxt-ui`          | Nuxt UI 4 元件使用    |
| `nuxt-better-auth` | 認證整合              |
| `vue`              | Vue 3 Composition API |
| `vueuse`           | VueUse composables    |
| `reka-ui`          | Headless UI 元件      |

### 情境 Skills（本地維護）

當特定開發情境發生時自動載入：

| Skill                | 觸發時機            | 說明                 |
| -------------------- | ------------------- | -------------------- |
| `supabase-rls`       | 建立 RLS Policy 時  | RLS 設計規範         |
| `supabase-migration` | 建立 migration 時   | Local-First 流程     |
| `server-api`         | 建立 Server API 時  | Zod 驗證、權限檢查   |
| `pinia-store`        | 建立 Pinia Store 時 | Composition API 寫法 |

### Skill 結構範例

```markdown
# Nuxt UI v4

## When to Use

- Installing/configuring @nuxt/ui
- Using UI components (Button, Card, Table, Form, etc.)
- Customizing theme

**For Vue component patterns:** use `vue` skill
**For Nuxt routing/server:** use `nuxt` skill

## Available Guidance

| File                       | Topics                         |
| -------------------------- | ------------------------------ |
| references/installation.md | Nuxt/Vue setup                 |
| references/theming.md      | Semantic colors, CSS variables |
| components/\*.md           | Per-component details          |

## Quick Reference

// nuxt.config.ts
export default defineNuxtConfig({
modules: ['@nuxt/ui'],
})
```

---

## 自動化工作流程

### 完成實作後的自動流程

```
完成實作
    │
    ▼
┌─────────────────────────────────────────┐
│  1. pnpm format                         │
│     ↓ 失敗 → 自動修復 → 重試            │
│  2. pnpm lint                           │
│     ↓ 失敗 → 分析錯誤 → 修復 → 重試     │
│  3. pnpm typecheck                      │
│     ↓ 失敗 → 分析類型錯誤 → 修復 → 重試 │
│  4. pnpm test                           │
│     ↓ 失敗 → 分析測試失敗 → 修復 → 重試 │
│  5. 全部通過                             │
└─────────────────────────────────────────┘
    │
    ▼
詢問：「檢查全部通過，是否要 commit？」
    │
    ▼
分析變更 → 建議分組 → 逐一 commit
    │
    ▼
詢問：「是否要升級版本？（minor / patch / 否）」
    │
    ▼
執行版本升級 + deploy commit + tag
```

### 自動 Commit 規範

```
<emoji type>: <description>

Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

| Emoji | Type     | Description   |
| ----- | -------- | ------------- |
| ✨    | feat     | New feature   |
| 🐛    | fix      | Bug fix       |
| 🧹    | chore    | Maintenance   |
| 🔨    | refactor | Refactoring   |
| 🧪    | test     | Testing       |
| 📝    | docs     | Documentation |
| 🚀    | deploy   | Deployment    |

### 自動 Migration 驗證

建立或修改 migration 後自動執行：

```bash
# 1. 重置資料庫測試 migration
supabase db reset

# 2. 安全檢查
supabase db lint --level warning

# 3. 重新產生 TypeScript 類型
supabase gen types typescript --local | tee app/types/database.types.ts > /dev/null

# 4. 類型檢查
pnpm typecheck
```

---

## AI 協作的 Do's and Don'ts

### ✅ Do's

1. **提供清晰的上下文**

```markdown
✅ 好的提示：
「我要在 /api/v1/users 新增一個 POST API，
用來建立使用者。請參考 API_DESIGN_GUIDE.md 的模式，
使用 Zod 驗證，並加入 requireUserSession 權限檢查。」
```

2. **使用 CLAUDE.md**

```markdown
✅ 好的做法：
在 CLAUDE.md 中明確定義規範，
讓 AI 在每次對話開始時就了解專案脈絡。
```

3. **分階段執行**

```markdown
✅ 好的做法：

1. 先請 AI 分析需求
2. 確認理解正確後，請 AI 設計測試
3. 確認測試案例後，請 AI 實作
4. 最後請 AI 驗證並重構
```

4. **驗證輸出**

```markdown
✅ 好的做法：

- 執行測試確認功能正確
- 檢查程式碼是否符合規範
- 使用 pnpm check 驗證所有檢查
```

### ❌ Don'ts

1. **不要盲目信任**

```markdown
❌ AI 可能會：

- 幻覺（編造不存在的 API）
- 過度自信（說「這樣就可以了」但其實不行）
- 忽略邊界案例

✅ 解決方式：

- 始終執行測試
- 質疑不確定的答案
- 要求提供參考來源
```

2. **不要省略規範**

```markdown
❌ 錯誤做法：
「幫我寫一個 API」

✅ 正確做法：
「依照 CLAUDE.md 的規範，
幫我寫一個 /api/v1/users 的 POST API」
```

3. **不要一次要求太多**

```markdown
❌ 錯誤做法：
「幫我實作完整的使用者管理系統，
包含 CRUD、權限、驗證、測試」

✅ 正確做法：
分成多個小任務，逐一完成
```

4. **不要忽略測試**

```markdown
❌ 錯誤做法：
「幫我寫功能就好，測試晚點再說」

✅ 正確做法：
遵循 TDD：先寫測試，再實作
```

---

## 踩坑經驗

### AI 不遵守規範的除錯方式

**問題**：AI 沒有按照 CLAUDE.md 的規範行事。

**原因**：

1. 規範不夠明確
2. 規範被其他上下文覆蓋
3. AI 的「習慣」與規範衝突

**解決**：

```markdown
1. 檢查規範是否足夠明確
   - 使用 MUST / NEVER / ALWAYS 強調
   - 提供正確和錯誤的範例

2. 在對話中重申關鍵規範
   - 「請確保使用繁體中文」
   - 「請遵循 TDD 流程」

3. 分階段確認每個步驟
   - 「你打算怎麼實作？」
   - 「這樣做符合規範嗎？」
```

### AI 產生的程式碼品質不佳

**問題**：AI 產生的程式碼可以跑，但風格不一致。

**解決**：

```markdown
1. 在 CLAUDE.md 明確定義 Code Style

2. 設定自動格式化
   - oxfmt / prettier
   - eslint / oxlint

3. 要求 AI 執行 pnpm check 後再提交
```

---

## 檢查清單

設定 AI 輔助開發時確認：

- [ ] CLAUDE.md 包含所有必要規範
- [ ] 規範使用 MUST / NEVER 等明確用語
- [ ] 提供正確和錯誤的範例
- [ ] 設定 AI Skills 目錄
- [ ] 自動化流程正確配置
- [ ] 團隊成員了解 AI 協作規範

---

## 最佳實踐總結

1. **CLAUDE.md 必備**：專案規範的單一來源
2. **Skills 分層**：技術 Skills 自動更新，情境 Skills 手動維護
3. **自動化優先**：讓 AI 執行重複性工作
4. **人類把關**：關鍵決策由人類做出
5. **持續驗證**：不要跳過測試和檢查
6. **分階段執行**：複雜任務拆分成小步驟

---

## 系列總結

恭喜你完成了「Nuxt 4 全棧實戰」系列！

我們涵蓋了：

1. **基礎架構**：專案結構、Nuxt UI、TypeScript
2. **認證授權**：Better Auth、RBAC
3. **Supabase**：Local-First、RLS、Function 安全
4. **Server API**：Nitro、Pinia Colada
5. **開發流程**：TDD、AI 輔助開發

這些實戰經驗來自真實專案的踩坑與學習，希望對你有幫助！

---

## 延伸閱讀

- [Claude Code 文件](https://docs.anthropic.com/claude/docs)
- [nuxt-skills](https://github.com/onmax/nuxt-skills)
- 上一篇：[TDD 與自動化測試](/nuxt/tdd-testing-workflow/)
- 系列首篇：[專案架構設計](/nuxt/fullstack-architecture/)
