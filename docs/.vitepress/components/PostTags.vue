<script setup lang="ts">
  import { data as posts } from '../theme/posts.data';
  import blogStore from '../theme/store';

  import { initTags } from '../theme/utils';

  const tags: object = initTags(posts);

  function selectTag(tag: string) {
    if (!blogStore.value.selectedTags.includes(tag)) {
      blogStore.value.selectedTags.push(tag);
    }
    blogStore.value.selectedCategory = '';
  }
</script>

<template>
  <div class="theme-container">
    <div
      v-if="blogStore.selectedTags.length > 0"
      class="row items-center text-lg text-bold mb-2"
    >
      篩選標籤：
      <VaChip
        v-for="(tag, idx) in blogStore.selectedTags"
        :key="idx"
        icon="close"
        class="pr-4 mx-1 mb-2"
        color="#424242"
        text-color="white"
        @click="blogStore.selectedTags.splice(idx, 1)"
      >
        {{ tag }}
      </VaChip>
    </div>

    <div class="flex flex-wrap">
      <div />
      <VaButton
        v-for="(_, tag) in tags"
        :key="tag"
        color="#00897b"
        class="px-2 mb-2 mr-3"
        @click="selectTag(tag)"
      >
        <span class="theme-badge"> {{ tag }} </span>
      </VaButton>
    </div>
  </div>
</template>

<style scoped>
  .vp-doc,
  a {
    font-weight: normal !important;
    color: initial !important;
    text-decoration: none !important;
    text-underline-offset: initial !important;
    transition: none !important;
  }

  .vp-doc,
  a:hover {
    font-weight: 500 !important;
    color: var(--vp-c-brand-1) !important;
    text-decoration-thickness: 2px !important;
    text-decoration: underline !important;
    text-underline-offset: 2px !important;
  }

  :deep(.va-chip__inner) {
    flex-direction: row-reverse;
  }
</style>
