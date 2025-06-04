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
      if (width <= 480) {
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
  <div class="optimized-image-container">
    <img
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      :class="[props.class, { loaded: isLoaded }]"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      style="max-width: 100%; height: auto; object-fit: contain;"
    >
  </div>
</template>

<style scoped>
.optimized-image-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.optimized-image-container img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  transition: opacity 0.3s ease;
  opacity: 0;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.optimized-image-container img.loaded {
  opacity: 1;
}

@media (max-width: 768px) {
  .optimized-image-container img {
    contain: layout style;
    will-change: auto;
  }
}
</style>
