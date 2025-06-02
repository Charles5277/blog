---
title: 在 Nuxt 專案中優雅處理 null 與 undefined
description: 透過 Maybe<T> 全域型別定義，在 Nuxt 專案中優雅地處理可能為 null 或 undefined 的值，提升型別安全和開發體驗。
datePublished: 2025-06-03
category: Nuxt
tags:
  - Nuxt
  - TypeScript

prev: false
next: false
---

在 Nuxt 專案 (及其他使用 TypeScript 的專案) 中，你一定遇過這些惱人的錯誤：

`null is not an object`、`undefined is not assignable`。

尤其在處理 API、DOM 或使用者輸入時，「空值」幾乎無所不在。

> **空值處理定義**：本文所指的「空值」包含 `null` 和 `undefined` 兩種情況，這是 JavaScript/TypeScript 開發中最常見的空值狀態。

如果每次都明確標註可能為空值 (`null | undefined`) 的型別，程式碼將變得冗長、重複，且容易產生 Typo，進而降低維護效率。

## 解決方案：`Maybe<T>` 型別

在 Nuxt 專案中建立 `/types/global.d.ts` 檔案：

```typescript
export {};

declare global {
  type Maybe<T> = T | null | undefined;
}
```

有了 `Maybe<T>`，空值處理就變得一致且明確，錯誤更容易在編譯時期被發現。

### 為什麼需要 `Maybe<T>`？

在 TypeScript 開發中，以下情況經常會產生型別錯誤：

```typescript
// ❌ 這些都會產生型別錯誤
const user: User = null;                              // API 回應可能為空值
const found: User = users.find(u => u.id === 3);     // find() 可能回傳空值
const element: HTMLElement = document.querySelector('.btn'); // DOM 查詢可能為空值

// ✅ 使用 Maybe<T> 正確處理空值
const user: Maybe<User> = null;
const found: Maybe<User> = users.find(u => u.id === 3) ?? null;
const element: Maybe<HTMLElement> = document.querySelector('.btn');
```

接下來我們看看實際專案中如何應用這個型別。

## 常見場景中，該怎麼用 `Maybe<T>`？

以下我們整理了 `Maybe<T>` 在常見開發場景中的實務用法，搭配 Nuxt 與 Composition API，使其更具可讀性與維護性：

### 1. API 回傳可能為 null？

在處理 API 回應時，資料常常可能不存在或為空：

```vue
<script setup lang="ts">
interface User {
  id: number;
  name: string;
  avatar?: string;
}

// 使用 Maybe<T> 明確表示 API 可能回傳空值
const { data: currentUser } = await useFetch<Maybe<User>>('/api/user/me');

// 安全地使用資料
const username = computed(() => currentUser?.name ?? '訪客');
const userAvatar = computed(() => currentUser?.avatar ?? '/default-avatar.png');
</script>

<template>
  <div>
    <h1>歡迎，{{ username }}</h1>
    <UserProfile v-if="currentUser" :user="currentUser" />
    <LoginPrompt v-else />
  </div>
</template>
```

### 2. 陣列查找結果可能為空？

`Array.find()` 方法經常會回傳空值：

```typescript
const products = ref<Product[]>([...]);
const productId = ref(3);

// 使用 Maybe<T> 處理可能的空值
const selectedProduct: Ref<Maybe<Product>> = ref(
  products.value.find(p => p.id === productId.value) ?? null
);

const productInfo = computed(() => 
  selectedProduct.value 
    ? `${selectedProduct.value.name} - ${selectedProduct.value.price}`
    : '找不到商品'
);
```

### 3. DOM 查詢可能回傳空值？

DOM 查詢方法可能回傳空值：

```typescript
// 使用 Maybe<T> 處理可能的空值
const button: Maybe<HTMLButtonElement> = document.querySelector('#submit-btn');

// 安全地操作 DOM 元素
const handleClick = () => {
  button?.setAttribute('disabled', 'true');
};
```

### 4. 非同步資料載入可能為空？

```vue
<script setup lang="ts">
// 使用 Maybe<T> 表示載入狀態
const posts: Ref<Maybe<BlogPost[]>> = ref(null);
const error: Ref<Maybe<string>> = ref(null);

const fetchPosts = async () => {
  try {
    const { data: response } = await useFetch<BlogPost[]>('/api/posts');
    posts.value = response.value;
  } catch (err) {
    error.value = '載入失敗';
    posts.value = null;
  }
};

const postCount = computed(() => posts.value?.length ?? 0);
</script>

<template>
  <div v-if="posts && posts.length > 0">
    <p>共 {{ postCount }} 篇文章</p>
    <article v-for="post in posts" :key="post.id">
      <h2>{{ post.title }}</h2>
    </article>
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>目前沒有文章</div>
</template>
```

## 常見 TypeScript 錯誤與解決方案

- 空值賦值錯誤：
當你嘗試將 null 指派給一個非空型別（例如 User）時，會出現錯誤訊息：
`Type 'null' is not assignable to type 'User'`
解決方式是使用 `Maybe<T>`，將變數型別定義為 `Maybe<User>`，讓 null 成為合法值：
```typescript:line-numbers
const user: Maybe<User> = null;
```

- 未定義賦值錯誤：
當一個變數預期為 string，但實際上可能是 undefined 時，會出現：
`Type 'undefined' is not assignable to type 'string'`
你可以將該型別改成 `Maybe<string>`，或在賦值時使用空值合併運算子確保不會是 undefined：
```typescript:line-numbers
const result: Maybe<string> = value ?? null;
```

- 可選屬性型別錯誤：
當 API 回傳可能是陣列或 undefined，你想將其存入嚴格的陣列型別時，會出現：
Type 'User[] | undefined' is not assignable to type 'User[]'
利用 Maybe<User[]> 可以包裝陣列，並允許 null 或 undefined：

```typescript:line-numbers
const users: Maybe<User[]> = response.data ?? null;
```

- 函式缺少回傳錯誤：
如果函式簽名指定回傳某型別，但在所有分支沒有明確回傳值，會出現：
Function lacks ending return statement
這時候將回傳型別設為 `Maybe<T>` 並確保所有分支有適當回傳值即可解決：

```typescript:line-numbers
const getUserName = (id: number): Maybe<string> => {
  if (id === 0) return null;
  // 其他邏輯...
};
```

## 總結

透過在 Nuxt 專案中定義 `Maybe<T>` 型別，我們獲得了：

### 核心優勢

- **型別安全**：編譯時期發現空值錯誤
- **程式碼清晰**：明確表達資料可能為空值的意圖
- **開發效率**：利用 Auto Import，無需重複定義

### 常見應用

- API 回應處理
- 陣列查找結果
- 表單狀態管理
- DOM 元素操作
- 非同步資料載入

`Maybe<T>` 只是開始。你可以進一步探索 `Result<T, E>`、`Option<T>` 等進階型別模式，打造語意明確、錯誤彈性的業務邏輯型別系統。
