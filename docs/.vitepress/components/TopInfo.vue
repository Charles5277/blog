<script setup lang="ts">
  import { useData } from 'vitepress';

  import catalogSheet from '../json/category.json';

  const { frontmatter } = useData();

  // const props = defineProps<{
  //   title: string;
  // }>();
</script>

<template>
  <div class="flex row justify-center">
    <div class="theme-title pb-6 text-4xl font-extrabold">
      {{ frontmatter.title }}
    </div>
  </div>

  <div class="flex row justify-center items-center text-lg">
    <span class="px-1"> 📆 </span>
    {{ frontmatter.datePublished.slice(0, 10) }} |
    <span class="px-2">
      <img :src="`/icons/${catalogSheet[frontmatter.category]}-sm.svg`" />
    </span>
    {{ frontmatter.category }}
  </div>

  <hr class="my-4 h-px bg-gray-300 border-0 dark:bg-gray-500" />
  <div class="flex row text-lg">
    <span class="whitespace-normal" v-text="frontmatter.description" />
  </div>
</template>
