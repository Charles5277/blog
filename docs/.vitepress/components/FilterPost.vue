<script setup lang="ts">
  import { withBase } from 'vitepress';
  import { ref, computed, onMounted } from 'vue';

  import { initCategory, initTags } from '../theme/utils';
  import { data as posts } from '../theme/posts.data';

  import type { Post } from '../theme/posts.data';

  import blogStore from '../theme/store';

  const tags = initTags(posts);
  const category = initCategory(posts);

  const postTitle = computed(() => {
    if (
      blogStore.value.selectedCategory === '' &&
      blogStore.value.selectedTags.length === 0
    ) {
      return '最新文章';
    } else if (filteredPosts.value.length === 0) {
      return '無符合篩選條件的文章';
    } else {
      return '篩選貼文';
    }
  });

  // - 篩選文章
  const filteredPosts = computed(() => {
    let arr: Post[] = [];
    const selectedTags = blogStore.value.selectedTags;
    const selectedCategory = blogStore.value.selectedCategory;

    if (selectedCategory) {
      // - 以 category 單選篩選
      arr = category[selectedCategory];
    } else if (selectedTags.length > 0) {
      // - 以 tags 複選篩選
      const addItemIfNeeded = (item: Post) => {
        if (!arr.includes(item)) {
          const hasAllTags = selectedTags.every((selectedTag) =>
            item.tags.includes(selectedTag),
          );
          if (hasAllTags) {
            arr.push(item);
          }
        }
      };

      selectedTags.forEach((tag) => {
        const items = tags[tag] || [];
        items.forEach(addItemIfNeeded);
      });
    } else {
      // > 如果沒有選擇類別或標籤，顯示所有文章
      arr = posts;
    }

    // - 按日期排序
    arr.sort((a, b) => {
      return (
        new Date(b.date.string).getTime() - new Date(a.date.string).getTime()
      );
    });

    return arr;
  });

  // - 文章分頁
  const itemsPerPage = 5;
  const currentPage = ref(1);

  const paginatedPosts = computed(() => {
    const startIdx = (currentPage.value - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredPosts.value.slice(startIdx, endIdx);
  });

  const pages = computed(() => {
    return Math.ceil(filteredPosts.value.length / itemsPerPage);
  });

  const goToPage = (page: number) => {
    currentPage.value = page;
  };

  // - 初始化時顯示所有文章
  onMounted(() => {
    blogStore.value.selectedCategory = '';
    blogStore.value.selectedTags = [];
  });
</script>

<template>
  <div>
    <div class="text-3xl font-extrabold">
      {{ postTitle }}
    </div>
    <div v-if="blogStore.selectedCategory !== ''">
      <h3 id="tagName" class="pb-2 flex row items-center">
        <span class="mr-4" v-html="blogStore.icon" />
        <span>{{ blogStore.selectedCategory }}</span>
      </h3>
    </div>
    <dl>
      <div
        v-for="post in paginatedPosts"
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

    <hr />

    <div class="flex justify-center">
      <VaPagination
        v-show="filteredPosts.values.length > 0"
        v-model="currentPage"
        :pages="pages"
        :visible-pages="5"
        gapped
        buttons-preset="primary"
        @update:model-value="goToPage"
      />
    </div>
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
