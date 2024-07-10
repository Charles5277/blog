<script setup lang='ts'>
  import { initTags } from '../theme/utils';
  import { data as posts } from '../theme/posts.data';

  import blogStore from '../theme/store';

  const tags = initTags(posts);

  function selectTag(tag: string) {
    if (!blogStore.value.selectedTags.includes(tag)) {
      blogStore.value.selectedTags.push(tag);
    }
    blogStore.value.selectedCategory = '';
  };
</script>

<template>
  <div class="theme-container">
    <div
      v-if="blogStore.selectedTags.length > 0"
      class="row items-center text-lg text-bold mb-2"
    >
      篩選標籤：
      <q-chip
        v-for="(tag, idx) in blogStore.selectedTags"
        :key="idx"
        class="pr-4"
        removable
        color="grey-9"
        text-color="white"
        @remove="blogStore.selectedTags.splice(idx, 1)"
      >
        {{ tag }}
      </q-chip>
    </div>

    <div class="flex flex-wrap">
      <div />
      <q-btn
        v-for="(_, tag) in tags"
        :key="tag"
        color="teal-7"
        class="px-2 mb-1 mr-3"
        no-caps
        @click="selectTag(tag)"
      >
        <span class="theme-badge">{{ tag }}</span>
      </q-btn>
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
</style>
