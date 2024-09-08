<script setup lang="ts">
  import { initCategory } from '../theme/utils';
  import { data as posts } from '../theme/posts.data';

  import blogStore from '../theme/store';

  const category = initCategory(posts);

  function categorySwitcher(item: string) {
    blogStore.value.selectedCategory = item;
    blogStore.value.selectedTags = [];
  }
</script>

<template>
  <div class="theme-container">
    <div class="flex flex-wrap">
      <VaButton
        v-for="(_, item) in category"
        :key="item"
        class="px-2 my-1 mr-3"
        color="#512da8"
        @click="categorySwitcher(`${item}`)"
      >
        <span class="theme-badge">{{ item }}</span>
      </VaButton>
    </div>
    <hr class="h-px my-4 bg-gray-200 border-0" />
  </div>
</template>
