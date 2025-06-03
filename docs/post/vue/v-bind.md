---
title: v-bind 屬性綁定指令
description: 透過 v-bind 屬性綁定，讓元素可以動態更新屬性
datePublished: 2024-09-09
lastUpdated: 2024-09-22 07:17:00 +8
category: Vue.js
tags:
  - Vue
  - Frontend
---

v-bind 是 Vue 提供的 [🔗 指令 (directive)](https://vuejs.org/api/built-in-directives.html#v-bind) 之一，用來綁定屬性。透過 v-bind 可以讓元素的屬性值動態更新，例如 class、style、href 等屬性。除了原生 HTML 元素的屬性之外，v-bind 也廣泛應用於自定義元件，特別是綁定 props 屬性。當你在使用自定義元件時，可以使用 v-bind 動態地將父元件的資料綁定到子元件的 props，使元件間的資料流更靈活且易於維護。

## 基本使用方式

1. `v-bind:attribute="變數名稱"`：在元素上使用 v-bind 指令，並指定屬性名稱與變數名稱。

2. `:attribute="變數名稱"`：`v-bind` 的縮寫，可以直接使用 `:` 符號來綁定屬性。

<br>

- 綁定 href 屬性

```vue:line-numbers
<script setup>
  import { ref } from 'vue';

  const url = ref('https://vuejs.org');
</script>

<template>
  <a v-bind:href="url">
    Vue.js Official Website
  </a>
  <a :href="url">
    Vue.js Official Website
  </a>
</template>
```

- 綁定 class 屬性

```vue:line-numbers
<script setup>
  import { ref } from 'vue';

  const isActive = ref(true);
</script>

<template>
  <div :class="{ active: isActive }">
    Active
  </div>
</template>

<style>
  .active {
    color: red;
  }
</style>
```

- 綁定 style 屬性

```vue:line-numbers
<script setup>
  import { ref } from 'vue';

  const color = ref('red');
</script>

<template>
  <div :style="{ color: color }">
    Color: {{ color }}
  </div>
</template>
```

- 綁定多個 class 或 style 屬性，以及搭配三元運算子

```vue:line-numbers
<script setup>
  import { ref } from 'vue';

  const isActive = ref(true);
  const color = 'red';
  const fontSize = '16px';
</script>

<template>
  <div
    :class="[isActive ? 'active' : 'inactive']"
    :style="[`color: ${color}; font-size: ${fontSize}`]"
  >
    Active
  </div>
</template>

<style>
  .active {
  color: red;
}

.inactive {
  color: blue;
}
</style>
```

- 綁定 component 的 props 屬性

```vue:line-numbers
<script setup>
  import { TestComponent } from './TestComponent.vue';
  import { ref } from 'vue';

  const message = ref('Hello, Vue.js!');
</script>

<template>
  <TestComponent :message="message" />
</template>
```
