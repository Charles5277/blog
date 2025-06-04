<!-- Index.vue -->
<script setup>
  import { useRouter, withBase } from 'vitepress';
  import Theme from 'vitepress/theme';
  import Comments from '../components/GiscusComments.vue';
  import OptimizedHeroImage from '../components/OptimizedHeroImage.vue';
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
      <!-- 超小型裝置載入最小圖片 -->
      <link
        rel="preload"
        as="image"
        :href="withBase('/home-256.webp')"
        media="(max-width: 320px)"
        fetchpriority="high"
      >
      <!-- 小型行動裝置載入mobile圖片 -->
      <link
        rel="preload"
        as="image"
        :href="withBase('/home-mobile.webp')"
        media="(min-width: 321px) and (max-width: 480px)"
        fetchpriority="high"
      >
      <!-- 中型行動裝置載入中等圖片 -->
      <link
        rel="preload"
        as="image"
        :href="withBase('/home-384.webp')"
        media="(min-width: 481px) and (max-width: 768px)"
        fetchpriority="high"
      >
      <!-- 桌面裝置載入較大圖片 -->
      <link
        rel="preload"
        as="image"
        :href="withBase('/home-512.webp')"
        media="(min-width: 769px)"
        fetchpriority="high"
      >
    </template>

    <!-- 自訂 Hero Image 為響應式版本 -->
    <template #home-hero-image>
      <OptimizedHeroImage
        src="home-512.webp"
        alt="Charles Blog Hero Image"
        class="VPImage image-src"
      />
    </template>

    <template #doc-before>
      <TopInfo v-if="$frontmatter.tags" />
    </template>

    <template #doc-footer-before>
      <div class="mb-4">
        <span v-if="$frontmatter.tags"> Tags: </span>
        <VaButton
          v-for="(tag, idx) in $frontmatter.tags"
          :key="idx"
          class="mr-2"
          size="small"
          color="#00897b"
          @click="searchTags(tag)"
        >
          <span> {{ tag }} </span>
        </VaButton>
      </div>
    </template>

    <template #doc-after>
      <Comments class="mt-8" />
    </template>
  </Layout>
</template>
