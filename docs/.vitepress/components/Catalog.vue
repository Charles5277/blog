<script setup>
  import FilterPost from './FilterPost.vue';
</script>

<template>
  <div class="text-3xl font-extrabold">
    主題
  </div>

  <Category class="mt-4" />

  <div class="text-3xl font-extrabold">
    標籤
  </div>

  <Tags class="mt-4" />

  <FilterPost />
</template>
