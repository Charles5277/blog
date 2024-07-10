<script setup lang='ts'>
  import { initCategory } from '../theme/utils';
  import { data as posts } from '../theme/posts.data';

  import blogStore from '../theme/store';

  const category = initCategory(posts);

  function categorySwitcher(item: string) {
    blogStore.value.selectedCategory = item;
    blogStore.value.selectedTags = [];
  };
</script>

<template>
  <div class="theme-container">
    <div class="flex flex-wrap">
      <q-btn
        v-for="(_, item) in category"
        :key="item"
        class="px-2 my-1 mr-3"
        color="deep-purple-8"
        no-caps
        @click="categorySwitcher(`${item}`)"
      >
        <span class="theme-badge">{{ item }}</span>
      </q-btn>
    </div>
    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-500">
  </div>
</template>
