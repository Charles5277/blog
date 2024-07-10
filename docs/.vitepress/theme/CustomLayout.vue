<!-- Index.vue -->
<script setup>
  import Theme from 'vitepress/theme';

  import { useRouter, withBase } from 'vitepress';
  import blogStore from '../theme/store';

  // - components
  import TopInfo from '../components/TopInfo.vue';

  const { Layout } = Theme;

  const { go } = useRouter();
  console.log(go);
</script>

<template>
  <Layout>
    <template #doc-top>
      <TopInfo v-if="$frontmatter.tags" />
    </template>

    <template #doc-footer-before>
      <div class="mb-4">
        <span v-if="$frontmatter.tags">Tags:</span>
        <q-btn
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
