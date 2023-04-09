<script lang="ts" setup>
import useVuelidate from '@vuelidate/core'
import { helpers, minLength } from '@vuelidate/validators'
import { computed } from 'vue'

import PageContainer from '@/components/layout/PageContainer.vue'
import { useDeliveryStore } from '~/stores/deliveryStore'

const deliveryStore = useDeliveryStore()
const router = useRouter()
const headers = [{ title: 'User Id', align: 'start', key: 'id' }, { key: 'delete', sortable: false }]

const items = computed(() => deliveryStore.getAllUsersIds.map(id => ({ id })))
const newUserId = ref('')
const isOpenDialogDelete = ref(false)
const userDeleteId = ref('')
const isReset = ref(false)
const v = useVuelidate({
  newUserId: {
    minLength: helpers.withMessage('User id should be at least 2 characters', minLength(2)),
    correctSymbols: helpers.withMessage(
      'id must contain only a-z, 0-9, -, _',
      (val: string) => /^[a-z0-9\-_]+$/.test(val),
    ),
  },
}, { newUserId })
const isNew = computed(() => !items.value.some(idObj => idObj.id === newUserId.value))
const isValid = computed(() => isReset.value || (v.value.$silentErrors.length === 0 && isNew.value))
const inputUserIdErrors = computed(() => {
  console.log('items === ', items.value)
  const errors = [...v.value.newUserId.$errors.map(er => er.$message)]
  if (!isNew.value) errors.push('User with such an id already exist')
  return errors
})
const onCreateId = () => {
  if (!isValid.value) return
  deliveryStore.addUser(newUserId.value)
  newUserId.value = ''
  v.value.$reset()
}
const onCreateAndGoTo = () => {
  if (!isValid.value) return
  v.value.$reset()
  // prevent validation error on page leave
  isReset.value = true
  deliveryStore.addUser(newUserId.value)
  router.push(`/${newUserId.value}/create`)
}
const onDeleteUser = (userId: string) => {
  userDeleteId.value = userId
  isOpenDialogDelete.value = true
}
const onConfirmDeleteUser = () => {
  deliveryStore.deleteUser(userDeleteId.value)
  isOpenDialogDelete.value = false
}
</script>

<template>
  <PageContainer class="items-center">
    <template #h1>
      Choose user or add new
    </template>
    <template #default>
      <div class="flex flex-col gap-4">
        <VTextField
          ref="inputRef"
          v-model="newUserId"
          class="mb-4"
          :class="{
            'input_with_error': !isNew,
            'input_with_success': isValid,
          }"
          label="user id"
          variant="outlined"
          :error-messages="inputUserIdErrors"
          @change="v.newUserId.$touch()"
          @keyup.enter="onCreateId"
        >
          <template #append-inner>
            <VIcon v-if="isValid" class="text-success opacity-100">mdi-account-check</VIcon>
          </template>
        </VTextField>
        <div class="flex justify-between gap-2">
          <VBtn
            class="grow"
            :disabled="!isValid"
            prepend-icon="mdi-creation"
            @click="onCreateId"
          >
            Add
          </VBtn>
          <VBtn
            :disabled="!isValid"
            prepend-icon="mdi-account-arrow-right"
            @click="onCreateAndGoTo"
          >
            Add and create request
          </VBtn>
        </div>
        <VDataTable
          :items="items"
          :headers="headers"
          item-value="name"
          class="elevation-1"
        >
          <template #item.delete="{ item }">
            <span class="flex justify-end">
              <VBtn
                class="p-1"
                size="x-small"
                icon="mdi-trash-can-outline"
                title="Delete User"
                :ripple="false"
                @click="onDeleteUser(item.value.id)"
              />
            </span>
          </template>
          <template #item.id="{ item }">
            <RouterLink
              class="flex w-full h-full items-center text-sky-500 hover:underline hover:text-pink-300"
              :to="`/${item.value.id}/requests`"
              title="Go to user requests"
            >
              {{ item.value.id }}
            </RouterLink>
          </template>
          <template #no-data>
            <tr>
              <td colspan="99" class="text-lg text-center">
                We don't have users yet. Please
                <span
                  class="text-accent cursor-pointer"
                  @click="$refs.inputRef.focus()"
                >create</span>
                a new user.
              </td>
            </tr>
          </template>
        </VDataTable>
      </div>
    </template>
  </Pagecontainer>
  <VDialog
    v-model="isOpenDialogDelete"
    width="500px"
    class="p-8 rounded"
  >
    <VCard>
      <VCardTitle class="text-h5">Are you sure you want to delete user {{ userDeleteId }}</VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isOpenDialogDelete = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="onConfirmDeleteUser"
        >
          OK
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
