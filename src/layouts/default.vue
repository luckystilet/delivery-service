<script lang="ts" setup>
import TheHeader from '@/components/layout/TheHeader.vue'
</script>
<template>
  <VApp
    id="app"
    tabindex="-100"
    style="outline: none;"
  >
    <TheHeader />
    <VContainer id="app_container">
      <VMain>
        <slot />
      </VMain>
    </VContainer>
  </VApp>
</template>
