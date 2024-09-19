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

    const arr: Post[] = [];
    const selectedTags = blogStore.value.selectedTags;

    const addItemIfNeeded = (item: Post) => {
      // 檢查該貼文是否已經在 arr 中
      if (!arr.includes(item)) {
        // 確保該貼文包含所有選中的標籤
        const hasAllTags = selectedTags.every((selectedTag) =>
          item.tags.includes(selectedTag),
        );

        if (hasAllTags) {
          arr.push(item);
        }
      }
    };

    // - 遍歷所有標籤
    selectedTags.forEach((tag) => {
      const items = tags[tag] || [];
      items.forEach(addItemIfNeeded);
    });

    // - 依照日期排序
    arr.sort((a, b) => {
      return (
        new Date(b.date.string).getTime() - new Date(a.date.string).getTime()
      );
    });

    return arr;
  });
</script>

<template>
  <div
    v-if="
      blogStore.selectedCategory !== '' || blogStore.selectedTags.length > 0
    "
  >
    <div class="text-3xl font-extrabold">篩選貼文</div>
    <div v-if="blogStore.selectedCategory !== ''">
      <h3 id="tagName" class="pb-2 flex row items-center">
        <span class="mr-4" v-html="blogStore.icon" />
        <span>{{ blogStore.selectedCategory }}</span>
      </h3>
    </div>
    <dl>
      <div
        v-for="post in filteredPosts"
        :key="post.title"
        class="decoration-2 hover:underline"
      >
        <dd
          class="flex justify-between my-3 text-base leading-6 font-medium text-gray-500 dark:text-gray-300"
        >
          <div class="list-disc truncate w-64 sm:w-fit pl-2">
            <li>
              <span
                v-if="blogStore.selectedCategory === ''"
                v-text="`${post.category} | `"
              ></span>
              <a :href="withBase(post.url)" class="hover:underline">
                {{ post.title }}
              </a>
            </li>
          </div>
          <div class="w-24">
            {{ post.date.string }}
          </div>
        </dd>
      </div>
    </dl>
  </div>
  <div v-else>
    <div class="text-3xl font-extrabold">請選擇主題或標籤</div>
  </div>
  <hr class="h-px my-4 bg-gray-200 border-0" />
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
