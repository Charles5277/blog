---
title: Nuxt UI 4 Dashboard 實戰
description: 使用 Nuxt UI 4 打造專業級 Dashboard 介面，涵蓋側邊欄、導航、響應式設計與主題配置的實作經驗。
datePublished: 2026-01-22
category: Nuxt
tags:
  - Nuxt
  - TypeScript
  - Architecture
---

# Nuxt UI 4 Dashboard 實戰

> 系列文章：Nuxt 4 全棧實戰（2/12）

## 這篇要解決什麼問題

打造一個專業級的 Dashboard 介面需要考慮：

- 側邊欄的展開/收合狀態管理
- 響應式設計（mobile/desktop 切換）
- 導航選單的類型安全
- 主題配置與暗色模式

---

## Nuxt UI 4 核心概念

### UApp 根元件

所有 Nuxt UI 元件必須包裹在 `UApp` 內，它提供：

- Toast 通知系統
- Tooltip 功能
- Overlay 管理
- 國際化（locale）

```vue
<script setup lang="ts">
import { zh_tw } from '@nuxt/ui/locale'
</script>

<template>
  <UApp :locale="zh_tw">
    <NuxtPage />
  </UApp>
</template>
```

### 語系化

Nuxt UI 4 內建多國語系，包括繁體中文：

```typescript
import { zh_tw } from '@nuxt/ui/locale'
// 元件內的文字（如 Select 的「無結果」）會自動翻譯
```

---

## Dashboard 元件組合

### 核心架構

Nuxt UI 提供完整的 Dashboard 元件組合：

| 元件 | 用途 |
|------|------|
| `UDashboardGroup` | 包裹整個 Dashboard，管理側邊欄狀態 |
| `UDashboardSidebar` | 可收合、可調整大小的側邊欄 |
| `UDashboardPanel` | 主內容區域 |
| `UDashboardNavbar` | 頂部導航欄 |
| `UDashboardToolbar` | 導航欄下方的工具列 |

### 基本 Layout 結構

```vue
<template>
  <UDashboardGroup unit="rem">
    <!-- 側邊欄：桌面版 -->
    <UDashboardSidebar
      collapsible
      resizable
      class="hidden lg:flex"
    >
      <template #header>
        <Logo />
      </template>

      <UNavigationMenu :items="menuItems" orientation="vertical" />

      <template #footer>
        <UserMenu />
      </template>
    </UDashboardSidebar>

    <!-- 主內容區 -->
    <UDashboardPanel>
      <UDashboardNavbar>
        <template #leading>
          <!-- Mobile toggle -->
          <UDashboardSidebarToggle class="lg:hidden" />
          <!-- Desktop collapse -->
          <UDashboardSidebarCollapse class="hidden lg:flex" />
        </template>

        <template #title>
          {{ pageTitle }}
        </template>
      </UDashboardNavbar>

      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
```

---

## 側邊欄狀態管理

### collapsible vs resizable

| Props | 效果 |
|-------|------|
| `collapsible` | 可以完全收合成只顯示 icon |
| `resizable` | 可以拖曳調整寬度 |

```vue
<UDashboardSidebar
  collapsible
  resizable
  :min-width="200"
  :max-width="400"
/>
```

### 收合按鈕

```vue
<!-- 桌面版：收合按鈕 -->
<UDashboardSidebarCollapse class="hidden lg:flex" />

<!-- 手機版：漢堡選單 -->
<UDashboardSidebarToggle class="lg:hidden" />
```

---

## NavigationMenu 導航選單

### 類型安全的選單項目

```typescript
import type { NavigationMenuItem } from '@nuxt/ui'

const menuItems: NavigationMenuItem[] = [
  {
    label: '首頁',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: '設定',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
  {
    label: '使用者管理',
    icon: 'i-lucide-users',
    children: [
      { label: '使用者列表', to: '/users' },
      { label: '新增使用者', to: '/users/new' },
    ],
  },
]
```

### NavigationMenuItem 常用屬性

| 屬性 | 類型 | 說明 |
|------|------|------|
| `label` | `string` | 顯示文字 |
| `icon` | `string` | Iconify 圖示（如 `i-lucide-house`） |
| `to` | `string` | 路由路徑 |
| `badge` | `string \| number` | 右側徽章 |
| `disabled` | `boolean` | 是否禁用 |
| `children` | `NavigationMenuItem[]` | 子選單 |
| `onSelect` | `(e: Event) => void` | 點擊事件 |

### Mobile 關閉側邊欄的技巧

在 mobile 版本，點擊選單項目後需要關閉側邊欄：

```vue
<script setup lang="ts">
const isMobile = useMediaQuery('(max-width: 1024px)')

const menuItems = computed<NavigationMenuItem[]>(() => [
  {
    label: '首頁',
    icon: 'i-lucide-house',
    to: '/',
    onSelect: () => {
      if (isMobile.value) {
        // 觸發側邊欄關閉
      }
    },
  },
])
</script>
```

---

## 主題配置

### app.config.ts

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc',
    },
  },
})
```

### 語意化顏色

| 顏色 | 預設值 | 用途 |
|------|--------|------|
| `primary` | green | CTA、品牌色、重要連結 |
| `secondary` | blue | 次要按鈕 |
| `success` | green | 成功訊息 |
| `error` | red | 錯誤訊息、危險操作 |
| `warning` | yellow | 警告訊息 |
| `neutral` | slate | 文字、邊框、禁用狀態 |

### CSS 變數

Nuxt UI 4 提供語意化的 CSS 變數：

```css
/* 文字 */
.text-dimmed    /* 佔位符、提示 */
.text-muted     /* 次要文字 */
.text-default   /* 主要文字 */
.text-highlighted /* 標題、強調 */

/* 背景 */
.bg-default     /* 頁面背景 */
.bg-muted       /* 區塊背景 */
.bg-elevated    /* 卡片、Modal */
.bg-accented    /* Hover 狀態 */
```

---

## 踩坑經驗

### 響應式設計的陷阱

**問題**：Desktop 和 Mobile 使用不同的側邊欄顯示方式。

**錯誤做法**：使用 `v-if` 切換：

```vue
<!-- ❌ 會導致狀態丟失 -->
<UDashboardSidebar v-if="!isMobile" />
<UDashboardSidebarMobile v-else />
```

**正確做法**：使用 CSS class 控制：

```vue
<!-- ✅ 同一個元件，用 CSS 控制顯示 -->
<UDashboardSidebar class="hidden lg:flex" />
```

### UDashboardGroup unit 設定

`unit` 決定側邊欄寬度的單位：

```vue
<!-- rem 更適合響應式設計 -->
<UDashboardGroup unit="rem">
```

### 忘記包 UApp

**問題**：Toast、Tooltip 無法顯示。

**解決**：確保 app.vue 有 `UApp` 包裹：

```vue
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

---

## 暗色模式

### ColorModeButton

```vue
<UColorModeButton />
```

### 程式控制

```typescript
const colorMode = useColorMode()

// 切換模式
colorMode.preference = 'dark'  // 'light', 'dark', 'system'
```

---

## 完整 Layout 範例

```vue
<script setup lang="ts">
import { zh_tw } from '@nuxt/ui/locale'
import type { NavigationMenuItem } from '@nuxt/ui'

const menuItems: NavigationMenuItem[] = [
  { label: '儀表板', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: '使用者', icon: 'i-lucide-users', to: '/users' },
  { label: '設定', icon: 'i-lucide-settings', to: '/settings' },
]
</script>

<template>
  <UApp :locale="zh_tw">
    <UDashboardGroup unit="rem">
      <UDashboardSidebar collapsible class="hidden lg:flex">
        <template #header>
          <div class="flex items-center gap-2 p-4">
            <UIcon name="i-lucide-box" class="size-6" />
            <span class="font-bold">My App</span>
          </div>
        </template>

        <UNavigationMenu
          :items="menuItems"
          orientation="vertical"
          class="flex-1"
        />

        <template #footer>
          <div class="p-4">
            <UColorModeButton />
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <UDashboardNavbar>
          <template #leading>
            <UDashboardSidebarToggle class="lg:hidden" />
            <UDashboardSidebarCollapse class="hidden lg:flex" />
          </template>
        </UDashboardNavbar>

        <main class="p-6">
          <slot />
        </main>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>
```

---

## 最佳實踐總結

1. **UApp 必備**：所有 Nuxt UI 應用都需要 UApp 包裹
2. **語系設定**：import `zh_tw` 提供繁體中文支援
3. **響應式用 CSS**：用 `class="hidden lg:flex"` 而非 `v-if`
4. **類型安全**：使用 `NavigationMenuItem` 類型定義選單
5. **語意化樣式**：使用 `text-muted`、`bg-elevated` 等 CSS 變數

---

## 延伸閱讀

- [Nuxt UI Dashboard 文件](https://ui.nuxt.com/components/dashboard-sidebar)
- [Nuxt UI Theme 配置](https://ui.nuxt.com/getting-started/theme)
- 上一篇：[專案架構設計](/nuxt/fullstack-architecture/)
- 下一篇：[TypeScript 類型安全實戰](/nuxt/typescript-type-safety/)
