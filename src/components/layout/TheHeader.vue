<script lang="ts" setup>
import { computed } from 'vue'
const route = useRoute()
const userId = computed(() => {
  return route.params.id ?? 'dummy-id'
})

const navData = [
  {
    class: 'ml-16',
    icon: 'mdi-nuxt',
    href: 'https://nuxt.com/',
    color: '#00DC82',
    title: 'Open Nuxt-3 Docs in the New Tab',
  },
  {
    class: '',
    icon: 'mdi-language-typescript',
    href: 'https://www.typescriptlang.org/',
    color: '#3178C6',
    title: 'Open TypeScript Docs in the New Tab',
  },
  {
    class: '',
    icon: 'mdi-vuetify',
    href: 'https://vuetifyjs.com/en/getting-started/installation/',
    color: '#1867C0',
    title: 'Open Vuetify-3 Docs in the New Tab',
  },
  {
    class: '',
    icon: 'mdi-fruit-pineapple',
    href: 'https://pinia.vuejs.org/',
    color: 'var(--c-accent)',
    title: 'Open Pinia Docs in the New Tab',
  },
  {
    class: '-mr-12',
    icon: 'mdi-tailwind',
    href: 'https://tailwindcss.com/docs/installation',
    color: '#38BDF8',
    title: 'Open Tailwind Docs in the New Tab',
  },
]
</script>
<template>
  <VAppBar
    absolute
    color="#111111"
    dark
    shrink-on-scroll
    prominent
    src="https://picsum.photos/1920/1080?random"
    fade-img-on-scroll
    scroll-target="#scrolling-techniques-3"
    elevation="2"
  >
    <VBtn
      v-for="(navItem, i) in navData"
      :key="i"
      :class="[navItem.class]"
      :icon="navItem.icon"
      size="x-large"
      :href="navItem.href"
      :color="navItem.color"
      target="_blank"
      :title="navItem.title"
    />
    <VSpacer />
    <div class="flex gap-4 -ml-12">
      <NuxtLink
        class="header_link"
        to="/"
        exact
      >
        Home
      </NuxtLink>
      <NuxtLink class="header_link" to="/requests">requests</NuxtLink>
      <NuxtLink class="header_link" :to="`/${userId}/requests`">id/requests</NuxtLink>
      <NuxtLink class="header_link" :to="`/${userId}/create`">id/create</NuxtLink>
      <NuxtLink class="header_link" :to="`/${userId}/create/order`">id/create/order</NuxtLink>
      <NuxtLink class="header_link" :to="`/${userId}/create/deliver`">id/create/deliver</NuxtLink>
    </div>
    <VSpacer />
  </VAppBar>
</template>
<style lang="scss">
  .header_link {
    color: var(--c-accent);
    font-weight: bold;
    font-size: 22px;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    -webkit-user-drag: none;
    padding: 4px 12px;
    transition: all .2s;
    &:not(.router-link-exact-active):hover {
      color: #ff99cc;
    }
  }
</style>
