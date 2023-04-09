<script lang="ts" setup>
import { computed } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import useVuelidate from '@vuelidate/core'
import { useNow } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

import { selectData } from '~/data/selectData'
import { requestHeaders } from '~/data/tables/requestHeaders'

import { useDeliveryStore } from '~/stores/deliveryStore'
import { formatDate } from '~/utils'
import { cityFrom, cityTo } from '~/vuelidate/inputs'

const toast = useToast()
const { removeRequest, updateRequest } = useDeliveryStore()
const { getUserRequestListWithMatches } = storeToRefs(useDeliveryStore())
const expanded = ref([])
const isOpenDialogDelete = ref(false)
const isOpenDialogContentType = ref(false)
const isOpenDialogDateEdit = ref(false)
const sortBy = ref([{ key: 'createdat', order: 'desc' }])
const temp = ref({
  requestId: '',
  remove: null,
  contentType: '',
  contentTypeId: '',
  dateEdit: '',
})
const newInputValue = ref('')
const minCalendarDate = useNow({ interval: 60 })
const userRequests = computed(() => getUserRequestListWithMatches.value)
console.log('userRequests === ', userRequests.value)
const onRemoveRequest = (item) => {
  isOpenDialogDelete.value = true
  temp.value.remove = item
}
const onCancelRemoveRequest = () => {
  temp.value.remove = null
  isOpenDialogDelete.value = false
}
const onConfirmRemoveRequest = async() => {
  try {
    await removeRequest(temp.value.remove)
    toast.success('You successfully removed request', { timeout: 4_000 })
  }
  catch (error) {
    toast.error('Failed removed request', { timeout: 4_000 })
  }
  finally {
    onCancelRemoveRequest()
  }
}

const rules = { cityFrom: cityFrom(), cityTo: cityFrom(), description: {} }
const onEditInputChange = (item, field: string, reset) => {
  const v = useVuelidate(rules[field], newInputValue)
  v.value.$touch()
  if (v.value.$invalid) {
    reset()
    toast.warning('Abort', { timeout: 1_000 })
  }
  else {
    updateRequest(item.id, field, newInputValue.value)
    toast.success('New value Saved', { timeout: 1_000 })
  }
  document.getElementById('app')?.focus()
  newInputValue.value = ''
}
const onAbortEdit = (reset) => {
  reset()
  document.getElementById('app')?.focus()
}
const onCancelChangeContentType = () => {
  isOpenDialogContentType.value = false
}
const onConfirmChangeContentType = () => {
  updateRequest(temp.value.contentTypeId, 'type', temp.value.contentType)
  isOpenDialogContentType.value = false
  temp.value.contentTypeId = ''
  toast.success('Saved', { timeout: 1_000 })
}
const onOpenTypeEditModal = (type, id) => {
  isOpenDialogContentType.value = true
  temp.value.contentType = type
  temp.value.contentTypeId = id
}
const onEditDate = (item) => {
  temp.value.dateEdit = item.date
  temp.value.requestId = item.id
  isOpenDialogDateEdit.value = true
}
const onConfirmDateEdit = () => {
  updateRequest(temp.value.requestId, 'date', new Date(temp.value.dateEdit).getTime())
  isOpenDialogDateEdit.value = false
  toast.success('Saved', { timeout: 1_000 })
}

</script>

<template>
  <VDataTable
    v-model:expanded="expanded"
    v-model:sort-by="sortBy"
    :headers="requestHeaders"
    :items="userRequests"
    item-value="name"
    show-expand
    class="elevation-1 text-sm"
  >
    <template #expanded-row="{ columns, item }">
      <tr
        v-for="itemObj in item.value.matches"
        :key="itemObj.id"
        class="tr_expanded"
      >
        <td>
          {{ itemObj.deliveryType }}
        </td>
        <td>
          {{ formatDate(itemObj.createdat) }}
        </td>
        <td>
          {{ formatDate(itemObj.date) }}
        </td>
        <td>
          {{ itemObj.cityFrom }}
        </td>
        <td>
          {{ itemObj.cityTo }}
        </td>
        <td>
          {{ itemObj.type }}
        </td>
        <td colspan="99">
          {{ itemObj.description }}
        </td>
      </tr>
    </template>
    <!--collapse arrow styles-->
    <template #item.data-table-expand="{ item, toggleExpand, isExpanded }">
      <VBtn
        v-if="item.value.matches.length"
        class="p-1"
        size="x-small"
        :icon="`mdi-transfer-${isExpanded(item) ? 'up' : 'down'}`"
        :ripple="false"
        :class="{ 'close_icon': isExpanded(item) }"
        title="Toggle Matches"
        @click="toggleExpand(item)"
      />
    </template>
    <template #item.createdat="{ item }">
      {{ formatDate(item.value.createdat) }}
    </template>
    <template #item.date="{ item }">
      <span class="cursor-pointer select-none" @click="onEditDate(item.value)">
        {{ formatDate(item.value.date) }}
      </span>
    </template>
    <template #item.remove="{ item }">
      <VBtn
        class="p-1"
        size="x-small"
        icon="mdi-trash-can-outline"
        title="Delete Request"
        :ripple="false"
        @click="onRemoveRequest(item.value)"
      />
    </template>
    <template #item.cityFrom="{ item }">
      <VTextField
        ref="inputRef"
        variant="plain"
        :model-value="item.value.cityFrom"
        @update:model-value="newInputValue = $event"
        @keyup.esc="onAbortEdit($refs.inputRef.reset)"
        @change="onEditInputChange(item.value, 'cityFrom', $refs.inputRef.reset)"
      />
    </template>
    <template #item.cityTo="{ item }">
      <VTextField
        ref="inputRef"
        variant="plain"
        :model-value="item.value.cityTo"
        @update:model-value="newInputValue = $event"
        @keyup.esc="onAbortEdit($refs.inputRef.reset)"
        @change="onEditInputChange(item.value, 'cityTo', $refs.inputRef.reset)"
      />
    </template>
    <template #item.description="{ item }">
      <!--no reset here, vuetify api [$refs.textareaRef.reset] is bugged-->
      <VTextarea
        v-if="item.value.deliveryType === 'order'"
        ref="textareaRef"
        rows="3"
        style="width: 400px;"
        no-resize
        variant="plain"
        :model-value="item.value.description"
        @update:model-value="newInputValue = $event"
        @change="onEditInputChange(item.value, 'description', $refs.textareaRef.reset)"
      />
    </template>
    <template #item.type="{ item }">
      <div
        v-if="item.value.deliveryType === 'order'"
        class="cursor-pointer"
        @click="onOpenTypeEditModal(item.value.type, item.value.id)"
      >
        {{ item.value.type }}
      </div>
    </template>
    <template #no-data>
      <tr>
        <td colspan="99" class="text-lg text-center">
          Please create
          <NuxtLink :to="`/${$route.params.id}/create/order`" class="text-accent underline">order</NuxtLink>
          or
          <NuxtLink :to="`/${$route.params.id}/create/deliver`" class="text-accent underline">deliver</NuxtLink>
        </td>
      </tr>
    </template>
  </VDataTable>
  <!--Change content type-->
  <VDialog
    v-model="isOpenDialogContentType"
    width="500px"
    class="p-8 rounded"
  >
    <VCard>
      <VCardTitle class="text-h5">Change content type</VCardTitle>
      <VCardText>
        <VSelect v-model="temp.contentType" :items="selectData" />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="onCancelChangeContentType"
        >
          Cancel
        </VBtn>
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="onConfirmChangeContentType"
        >
          OK
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <!--Delete request-->
  <VDialog
    v-model="isOpenDialogDelete"
    width="500px"
    class="p-8 rounded"
  >
    <VCard>
      <VCardTitle class="text-h5">Are you sure you want to delete this request?</VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="onCancelRemoveRequest"
        >
          Cancel
        </VBtn>
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="onConfirmRemoveRequest"
        >
          OK
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <!--Change request date-->
  <VDialog
    v-model="isOpenDialogDateEdit"
    width="500px"
    class="p-8 rounded"
  >
    <VCard>
      <VCardTitle class="text-h5">Choose new request date</VCardTitle>
      <VCardText>
        <VueDatePicker
          v-model="temp.dateEdit"
          auto-apply
          prevent-min-max-navigation
          :min-date="minCalendarDate"
          :teleport="true"
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isOpenDialogDateEdit = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="onConfirmDateEdit"
        >
          OK
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
