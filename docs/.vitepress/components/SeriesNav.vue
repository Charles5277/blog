<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { data as seriesData } from "../theme/series.data";

const { frontmatter, page } = useData();

const currentSeries = computed(() => {
  const seriesId = frontmatter.value.series;
  if (!seriesId || !seriesData[seriesId]) return null;
  return seriesData[seriesId];
});

const currentIndex = computed(() => {
  if (!currentSeries.value) return -1;
  const currentUrl = page.value.relativePath
    .replace(/\.md$/, "")
    .replace(/index$/, "");
  return currentSeries.value.posts.findIndex((post) => {
    const postUrl = post.url.replace(/^\//, "").replace(/\/$/, "");
    const normalizedCurrent = currentUrl.replace(/^\//, "").replace(/\/$/, "");
    return postUrl === normalizedCurrent || postUrl === normalizedCurrent + "/";
  });
});

const prevPost = computed(() => {
  if (!currentSeries.value || currentIndex.value <= 0) return null;
  return currentSeries.value.posts[currentIndex.value - 1];
});

const nextPost = computed(() => {
  if (!currentSeries.value || currentIndex.value < 0) return null;
  if (currentIndex.value >= currentSeries.value.posts.length - 1) return null;
  return currentSeries.value.posts[currentIndex.value + 1];
});

const totalPosts = computed(() => currentSeries.value?.posts.length ?? 0);
const currentOrder = computed(() => currentIndex.value + 1);
</script>

<template>
  <div v-if="currentSeries" class="series-nav">
    <div class="series-header">
      <span class="series-badge">{{ currentSeries.seriesTitle }}</span>
      <span class="series-progress">{{ currentOrder }} / {{ totalPosts }}</span>
    </div>

    <div class="series-links">
      <a
        v-if="prevPost"
        :href="withBase(prevPost.url)"
        class="series-link prev"
      >
        <span class="nav-label">上一篇</span>
        <span class="nav-title">{{ prevPost.title }}</span>
      </a>
      <div v-else class="series-link prev disabled">
        <span class="nav-label">上一篇</span>
        <span class="nav-title">這是第一篇</span>
      </div>

      <a
        v-if="nextPost"
        :href="withBase(nextPost.url)"
        class="series-link next"
      >
        <span class="nav-label">下一篇</span>
        <span class="nav-title">{{ nextPost.title }}</span>
      </a>
      <div v-else class="series-link next disabled">
        <span class="nav-label">下一篇</span>
        <span class="nav-title">系列完結</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.series-nav {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.series-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.series-badge {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.series-progress {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.series-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.series-link {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.series-link:not(.disabled):hover {
  background: var(--vp-c-bg-elv);
}

.series-link.prev {
  text-align: left;
}

.series-link.next {
  text-align: right;
}

.series-link.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.nav-title {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.series-link:not(.disabled) .nav-title {
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .series-links {
    grid-template-columns: 1fr;
  }

  .series-link.next {
    text-align: left;
  }
}
</style>
