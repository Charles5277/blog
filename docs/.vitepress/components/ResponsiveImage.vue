<script setup lang="ts">
  import { withBase } from 'vitepress';

  interface Props {
    baseName: string;
    alt: string;
    sizes?: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
  }

  withDefaults(defineProps<Props>(), {
    sizes: '(max-width: 320px) 256px, (max-width: 480px) 384px, (max-width: 768px) 512px, 1024px',
    loading: 'eager',
    fetchpriority: 'high',
  });

  // 生成不同尺寸的圖片路徑
  function generateSrcSet(baseName: string) {
    const sizes = ['256', '384', 'mobile', '512'];
    return sizes
      .map((size) => {
        const suffix = size === 'mobile' ? 'mobile' : size;
        const width = size === 'mobile' ? '480' : size;
        return `${withBase(`/${baseName}-${suffix}.webp`)} ${width}w`;
      })
      .join(', ');
  }
</script>

<template>
  <img
    :src="withBase(`/${baseName}-512.webp`)"
    :srcset="generateSrcSet(baseName)"
    :sizes="sizes"
    :alt="alt"
    :class="className"
    :loading="loading"
    :fetchpriority="fetchpriority"
    decoding="async"
    style="content-visibility: auto; contain-intrinsic-size: 400px;"
  >
</template>
