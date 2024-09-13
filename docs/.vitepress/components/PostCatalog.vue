<script setup>
  import FilterPost from './FilterPost.vue';
</script>

<template>
  <FilterPost />

  <div class="text-3xl font-extrabold">主題</div>
  <PostCategory class="mt-4" />

  <div class="text-3xl font-extrabold">標籤</div>
  <PostTags class="mt-4" />
</template>
