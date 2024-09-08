<script setup>
  import { ref } from 'vue';

  const isActive = ref(true);
  const color = 'red';
  const fontSize = '16px';
</script>

<template>
  <div
    :class="[isActive ? 'active' : 'inactive']"
    :style="[`color: ${color}; font-size: ${fontSize}`]"
  >
    Active
  </div>
</template>

<style>
  .active {
    color: red;
  }

  .inactive {
    color: blue;
  }
</style>
