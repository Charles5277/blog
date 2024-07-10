<script setup>
  import { onMounted } from 'vue';
  import FilterPost from './FilterPost.vue';

  onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.has('category')); // true
    console.log(urlParams.get('category')); // "andy"
  });
</script>

<template>
  <div class="text-3xl font-extrabold">
    分類
  </div>

  <Category class="mt-4" />

  <div class="text-3xl font-extrabold">
    標籤
  </div>

  <Tags class="mt-4" />

  <FilterPost />
</template>
