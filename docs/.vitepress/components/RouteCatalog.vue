<script setup lang="ts">
  import { useRouter, withBase } from 'vitepress';
  import { onBeforeMount } from 'vue';

  import blogStore from '../theme/store';

  const props = defineProps<{
    category: string;
  }>();

  const { go } = useRouter();

  onBeforeMount(() => {
    blogStore.value.selectedCategory = props.category;
    blogStore.value.selectedTags = [];
    go(withBase('/catalog/'));
  });
</script>

<template>
  <slot />
</template>
