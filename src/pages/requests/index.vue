<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { requestHeaders } from '~/data/tables/requestHeaders'
import { useDeliveryStore } from '~/stores/deliveryStore'
import { formatDate } from '~/utils'
const { getAllUsersAllRequests: allUsersAllRequests } = storeToRefs(useDeliveryStore())

const sortBy = ref([{ key: 'createdat', order: 'desc' }])
</script>

<template>
  <VDataTable
    v-model:sort-by="sortBy"
    :headers="requestHeaders"
    :items="allUsersAllRequests"
    item-value="name"
    class="elevation-1"
  >
    <template #item.createdat="{ item }">
      {{ formatDate(item.value.createdat) }}
    </template>
    <template #item.date="{ item }">
      {{ formatDate(item.value.date) }}
    </template>
    <template #item.description="{ item }">
      <div
        v-if="item.value.deliveryType === 'order'"
        style="max-width: 500px"
      >
        {{ item.value.description }}
      </div>
    </template>
    <template #no-data>
      <tr>
        <td colspan="99" class="text-lg text-center">
          We don't have users yet. Please
          <NuxtLink to="/" class="text-accent underline">create a user.</NuxtLink>
        </td>
      </tr>
    </template>
  </VDataTable>
</template>
