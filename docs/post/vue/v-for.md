---
title: v-for 迴圈指令
description: 透過 v-for 迴圈指令，讓元素可以動態渲染數據。
date: 2024-09-09 23:53
category: Vue.js
tags:
  - Vue

lastUpdated: true

prev:
  text: v-bind 屬性綁定指令
  link: '/post/vue/v-bind'
next: false
---

v-for 是 Vue 提供的 [🔗 指令(directive)](https://vuejs.org/api/built-in-directives.html#v-for) 之一，用於在 `<template>` 中遍歷數據。如同普遍高階程式語言常用的 for 迴圈，在渲染介面元素時，透過這個指令可以直覺且高效的產生動態且大量的數據。

## 適用的資料型別

- Array
- Object
- Number
- String
- Iterable

## 基本使用方式

```vue:line-numbers
<script setup>
  import { ref } from 'vue';

  const listArr = ref(['Mike', 'Jacky', 'Andy']);

  const info = ref({
    name: 'Chris',
    age: 18,
  });

  const str = ref('Hello Vue3');
</script>

<template>
  <!-- number -->
  <ul>
    <li v-for="(i, idx) in 5">
      <h1>{{ idx }} : {{ i }}</h1>
    </li>
  </ul>
  <!-- string -->
  <ul>
    <li v-for="(item, idx) in str">
      <h1>{{ idx }}: {{ item }}</h1>
    </li>
  </ul>
  <!-- array -->
  <ul>
    <li v-for="(item, idx) in listArr">
      <h1>{{ idx }}: {{ item }}</h1>
    </li>
  </ul>
  <!-- object -->
  <ul>
    <li v-for="(val, key, idx) in info">
      <h1>{{ idx }}: {{ key }}: {{ val }}</h1>
    </li>
  </ul>
</template>
```
