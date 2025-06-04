<script setup lang="ts">
  import { withBase } from 'vitepress';
  import { onMounted, ref } from 'vue';

  interface Props {
    src: string;
    alt: string;
    class?: string;
  }

  const props = defineProps<Props>();
  const imgRef = ref<HTMLImageElement>();
  const isLoaded = ref(false);
  const currentSrc = ref('');

  // 根據裝置選擇最適合的圖片
  function selectOptimalImage() {
    const width = window.innerWidth;

    if (props.src === 'home.webp' || props.src === 'home-512.webp') {
      if (width <= 320) {
        return withBase('/home-256.webp');
      }
      else if (width <= 480) {
        return withBase('/home-mobile.webp');
      }
      else if (width <= 768) {
        return withBase('/home-384.webp');
      }
      else {
        return withBase('/home-512.webp');
      }
    }

    return withBase(`/${props.src}`);
  }

  onMounted(() => {
    currentSrc.value = selectOptimalImage();

    if (imgRef.value) {
      imgRef.value.onload = () => {
        isLoaded.value = true;
      };
    }
  });
</script>

<template>
  <img
    ref="imgRef"
    :src="currentSrc"
    :alt="alt"
    :class="[props.class, { loaded: isLoaded }]"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  >
</template>

<style scoped>
img {
  transition: opacity 0.3s ease;
  opacity: 0;
}

img.loaded {
  opacity: 1;
}
</style>
