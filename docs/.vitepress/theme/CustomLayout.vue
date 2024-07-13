<!-- Index.vue -->
<script setup>
  import Theme from 'vitepress/theme';
  import { useRouter, withBase } from 'vitepress';
  import blogStore from '../theme/store';

  // - components
  import TopInfo from '../components/TopInfo.vue';

  const { Layout } = Theme;
  const { go } = useRouter();

  function searchCategory(category) {
    blogStore.value.selectedCategory = category;
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
          Tags:

          <VaButton
            v-for="(tag, idx) in $frontmatter.tags"
            :key="idx"
            size="small"
            color="#00897b"
            class="ml-2"
            @click="searchCategory(tag)"
          >
            <span
              class="theme-badge"
            >
              {{ tag }}
            </span>
          </VaButton>
        </div>

        <button
          v-for="tag in $frontmatter.tags"
          :key="tag"
          :label="tag"
          color="grey-9"
          dense
          no-caps
          class="mx-1 px-2"
          @click="switchTagPage(tag)"
        />
      </div>
    </template>
  </Layout>
</template>
