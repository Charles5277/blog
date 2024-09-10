---
title: v-on 事件綁定指令
description: 透過 v-on 事件綁定，讓元素可以觸發事件
date: 2024-09-09
category: Vue.js
tags:
  - Vue

lastUpdated: true

prev:
  text: 介紹 Vue.js
  link: '/post/vue/introduction-to-vue'
next:
  text: v-bind 屬性綁定指令
  link: '/post/vue/v-bind'
---

v-on 是 Vue 提供的[🔗 指令(directive)](https://vuejs.org/api/built-in-directives.html#built-in-directives#v-on)之一，用來綁定事件。透過 v-on 可以讓元素觸發事件，例如點擊、滑鼠移入、滑鼠移出等事件發生時，執行指定的方法。

## 基本使用方式

1. `v-on:event="function"`：在元素上使用 v-on 指令，並指定 event 與 function 。
2. `@event="function"`：`v-on` 的縮寫，可以直接使用 `@` 符號來綁定 event。

```vue:line-numbers {8,11}
<script setup>
  import { ref } from 'vue';
  const counter = ref(1);
</script>

<template>
  <h1>Counter: {{ counter }}</h1>
  <button v-on:click="counter++">
    Increment
  </button>
  <button @click="counter--">
    Decrement
  </button>
</template>
```

## 傳入參數使用

有時候我們需要在觸發事件時，傳入一些參數給方法。這時可以透過 `$event` 來取得事件物件，或是直接在事件名稱後面加上參數。

```vue:line-numbers {6,14}
<script setup>
  import { ref } from 'vue';

  const name = ref('');

  const changeName = (newName, e) =>{
    name.value = newName;
    console.log(e);
    // PointerEvent {isTrusted: true, _vts: 1725820441615, pointerId: 1, width: 1, height: 1, …}
    console.log(e.target);
    // <button> Change </button>
  }
</script>

<template>
  <h1>Your name is: {{ name }}</h1>
  <button @click="changeName('John', $event)">
    Change
  </button>
</template>
```

## 延伸閱讀

[🔗 事件處理(Event Handling)](https://vuejs.org/guide/essentials/event-handling.html)
