<!-- Index.vue -->
<script setup>
  import { useRouter, withBase } from 'vitepress';
  import Theme from 'vitepress/theme';
  import Comments from '../components/GiscusComments.vue';
  import TopInfo from '../components/TopInfo.vue';
  import blogStore from '../theme/store';

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
    <!-- LCP 優化：預載入首頁關鍵圖片資源 -->
    <template #home-hero-before>
      <link rel="preload" as="image" :href="withBase('/home-512.webp')" fetchpriority="high">
      <link rel="preload" as="image" :href="withBase('/home-384.webp')" media="(max-width: 480px)">
      <link rel="preload" as="image" :href="withBase('/home-256.webp')" media="(max-width: 320px)">
    </template>
    <template #doc-before>
      <TopInfo v-if="$frontmatter.tags" />
    </template>

    <template #doc-footer-before>
      <div>
        <div>
          <span v-if="$frontmatter.tags"> Tags: </span>
          <VaButton
            v-for="(tag, idx) in $frontmatter.tags" :key="idx" size="small" color="#00897b"
            @click="searchTags(tag)"
          >
            <span> {{ tag }} </span>
          </VaButton>
        </div>
      </div>
    </template>

    <template #doc-after>
      <Comments class="mt-8" />
    </template>
  </Layout>
</template>
