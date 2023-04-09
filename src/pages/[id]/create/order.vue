<script lang="ts" setup>
import ParcelForm from '@/components/forms/ParcelForm.vue'
import PageContainer from '@/components/layout/PageContainer.vue'

</script>

<template>
  <PageContainer class="items-center">
    <template #h1>
      Create Your Order
    </template>
    <template #default>
      <ParcelForm is-order />
    </template>
  </Pagecontainer>
</template>
