<!-- Index.vue -->
<script setup>
  import Theme from 'vitepress/theme';
  import { useRouter, withBase } from 'vitepress';
  import blogStore from '../theme/store';

  // - components
  import TopInfo from '../components/TopInfo.vue';
  import Comments from '../components/GiscusComments.vue';

  const { Layout } = Theme;
  const { go } = useRouter();

  function searchTags(tag) {
    blogStore.value.selectedTags = [];
    blogStore.value.selectedCategory = '';
    blogStore.value.selectedTags.push(tag);
    go(withBase('/catalog/'));
  }
</script>

<template>
  <Layout>
    <template #doc-before>
      <TopInfo v-if="$frontmatter.tags" />
    </template>

    <template #doc-footer-before>
      <div class="mb-4">
        <div class="flex row item-center">
          <span v-if="$frontmatter.tags"> Tags: </span>
          <VaButton
            v-for="(tag, idx) in $frontmatter.tags"
            :key="idx"
            size="small"
            color="#00897b"
            class="ml-2"
            @click="searchTags(tag)"
          >
            <span class="theme-badge"> {{ tag }} </span>
          </VaButton>
        </div>
      </div>
    </template>

    <template #doc-after>
      <div class="my-6" style="border-top: 1px solid var(--vp-c-divider)"></div>
      <Comments />
    </template>
  </Layout>
</template>
