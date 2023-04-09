<script lang="ts" setup>
import PageContainer from '@/components/layout/PageContainer.vue'
import type { ISelectItem } from '~/types/selectTypes'
import MyFormWrapper from '@/components/MyFormWrapper.vue'

enum ECreateSelectValues {
  order = 'order',
  deliver = 'deliver'
}
const selectItems: ISelectItem[] = [
  {
    title: 'Order',
    value: ECreateSelectValues.order,
  },
  {
    title: 'Deliver',
    value: ECreateSelectValues.deliver,
  },
]
const selectResult = ref<null | ECreateSelectValues>(null)
</script>

<template>
  <PageContainer class="items-center">
    <template #h1>
      Choose action
    </template>
    <MyFormWrapper>
      <template #default>
        <VSelect
          v-model="selectResult"
          label="select"
          :items="selectItems"
        />
      </template>
      <template #controls>
        <VBtn
          block
          class="mx-auto"
          prepend-icon="mdi-creation"
          :disabled="!selectResult"
          :to="{path: `/${$route.params.id}/create${selectResult ? `/${selectResult}` : ''}`}"
        >
          Continue
        </VBtn>
      </template>
    </MyFormWrapper>
  </PageContainer>
</template>
