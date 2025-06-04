<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
    class?: string;
    style?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: 'lazy',
    fetchpriority: 'auto',
  });

  const imageStyle = computed(() => {
    let styles = props.style || '';

    if (props.width && props.height) {
      const aspectRatio = `aspect-ratio: ${props.width} / ${props.height};`;
      styles += styles ? `; ${aspectRatio}` : aspectRatio;
    }

    return styles;
  });
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :width="width"
    :height="height"
    :class="props.class"
    :style="imageStyle"
  >
</template>
