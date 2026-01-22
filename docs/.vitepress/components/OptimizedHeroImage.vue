<script setup lang="ts">
import { withBase } from "vitepress";
import { onMounted, ref } from "vue";

interface Props {
  src: string;
  alt: string;
  class?: string;
  lazy?: boolean; // 是否使用 lazy loading
  priority?: boolean; // 是否為優先載入（如 hero image）
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true,
  priority: false,
});

const imgRef = ref<HTMLImageElement>();
const isLoaded = ref(false);
const currentSrc = ref("");

// 根據裝置選擇最適合的圖片
function selectOptimalImage() {
  const width = window.innerWidth;

  if (props.src === "home.webp" || props.src === "home-512.webp") {
    if (width <= 320) {
      return withBase("/home-256.webp");
    } else if (width <= 480) {
      return withBase("/home-mobile.webp");
    } else if (width <= 768) {
      return withBase("/home-384.webp");
    } else {
      return withBase("/home-512.webp");
    }
  }

  return withBase(`/${props.src}`);
}

// 處理圖片載入完成
function handleImageLoad() {
  isLoaded.value = true;
}

// 處理圖片載入錯誤
function handleImageError() {
  console.warn(`Failed to load image: ${currentSrc.value}`);
}

onMounted(() => {
  // 設置圖片來源
  currentSrc.value = selectOptimalImage();
});
</script>

<template>
  <img
    ref="imgRef"
    :src="currentSrc"
    :alt="alt"
    :class="[props.class, { loaded: isLoaded }]"
    :loading="props.lazy ? 'lazy' : 'eager'"
    :fetchpriority="props.priority ? 'high' : 'auto'"
    decoding="async"
    @load="handleImageLoad"
    @error="handleImageError"
  />
</template>

<style scoped>
img {
  transition: opacity 0.3s ease;
  opacity: 0;
  max-width: 100%;
  height: auto;
}

img.loaded {
  opacity: 1;
}

/* 為 lazy loading 圖片添加載入指示器 */
img[loading="lazy"]:not(.loaded) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 高優先級圖片的優化 */
img[fetchpriority="high"] {
  content-visibility: auto;
}
</style>
