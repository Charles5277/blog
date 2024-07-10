<script setup lang='ts'>
  import { useData } from 'vitepress';

  import iconSheet from '../json/icon-sheet.json';

  const { frontmatter } = useData();

  // const props = defineProps<{
  //   title: string;
  // }>();
</script>

<template>
  <div class="flex row justify-center">
    <span class="theme-title pb-6 text-4xl font-extrabold">
      {{ frontmatter.title }}
    </span>
  </div>
  <div class="flex row justify-center items-center text-lg">
    <span class="px-1">
      📆
    </span>
    {{ frontmatter.date.slice(0, 10) }} |
    <span
      class="px-2"
      v-html="iconSheet.label[frontmatter.category]"
    />
    {{ frontmatter.category }}
  </div>
</template>
