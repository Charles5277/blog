<script setup lang="ts">
  import { withBase } from 'vitepress';
  import { computed } from 'vue';
  import { initCategory, initTags } from '../theme/utils';
  import { data as posts } from '../theme/posts.data';

  import type { Post } from '../theme/posts.data';

  import blogStore from '../theme/store';

  const tags = initTags(posts);
  const category = initCategory(posts);

  const filteredPosts = computed(() => {
    if (blogStore.value.selectedCategory) {
      return category[blogStore.value.selectedCategory];
    }
    else {
      const arr: Post[] = [];
      blogStore.value.selectedTags.forEach((tag) => {
        arr.push(...tags[tag]);
      });

      return arr;
    }
  });
</script>

<template>
  <div v-if="blogStore.selectedCategory !== ''">
    <h3
      id="tagName"
      class="pb-2 flex row items-center"
    >
      <span
        class="mr-4"
        v-html="blogStore.icon"
      />
      <span>{{ blogStore.selectedCategory }}</span>
    </h3>
  </div>
  <dl>
    <a
      v-for="post in filteredPosts"
      :key="post.title"
      class="decoration-2 hover:underline"
      :href="withBase(post.url)"
    >
      <dd
        class="flex justify-between  my-3 text-base leading-6 font-medium
          text-gray-500 dark:text-gray-300"
      >
        <div class="list-disc truncate w-64 sm:w-fit pl-2">
          <li>
            <span
              v-if="blogStore.selectedCategory === ''"
              v-text="
                `${post.category}
              |
              `"
            />
            {{ post.title }}</li>
        </div>
        <div class="w-24">
          {{ post.date.string }}
        </div>

      </dd>
    </a>
  </dl>
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
