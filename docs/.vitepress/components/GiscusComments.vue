<script setup lang="ts">
  import { useData } from 'vitepress';

  const { title, frontmatter } = useData();
</script>

<template>
  <div v-if="frontmatter.comments !== false" :key="title" class="giscus">
    <component
      is="script"
      src="https://giscus.app/client.js"
      data-repo="Charles5277/blog"
      data-repo-id="R_kgDOMR7YbQ"
      data-category="General"
      data-category-id="DIC_kwDOMR7Ybc4CjbTG"
      data-mapping="title"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="transparent_dark"
      data-lang="zh-TW"
      data-loading="lazy"
      async
      crossorigin="anonymous"
    />
  </div>
</template>
