<script lang="ts" setup>
import useVuelidate from '@vuelidate/core'
import { useNow } from '@vueuse/core'
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'

import { useToast } from 'vue-toastification'

import MyFormWrapper from '@/components/MyFormWrapper.vue'
import { selectData } from '~/data/selectData'
import { useDeliveryStore } from '~/stores/deliveryStore'
import { EDeliveryTypes } from '~/types/deliveryTypes'
import '@vuepic/vue-datepicker/dist/main.css'
import { cityFrom, cityTo } from '~/vuelidate/inputs'
import type { IFormValidateParcel } from '@/types/forms/parcelFormTypes'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  isOrder: { type: Boolean },
})

const deliveryStore = useDeliveryStore()

const toast = useToast()

const minCalendarDate = useNow({ interval: 60 })

const initForm = () => ({
  cityFrom: '',
  cityTo: '',
  type: null,
  date: null,
  description: '',
})
const form = ref<IFormValidateParcel>(initForm())

const rules = {
  cityFrom: cityFrom(),
  cityTo: cityTo(),
}
const v = useVuelidate(rules, form)

const onSubmit = async() => {
  if (form.value.date !== null) {
    form.value.date = new Date(form.value.date).getTime()
  }
  const isSuccess = props.isOrder
    ? await deliveryStore.addOrder({ ...form.value, deliveryType: EDeliveryTypes.order })
    : await deliveryStore.addDeliver({
      cityFrom: form.value.cityFrom,
      cityTo: form.value.cityTo,
      date: form.value.date,
      deliveryType: EDeliveryTypes.deliver,
    })
  if (isSuccess) {
    toast.success(`You successfully created new ${props.isOrder ? 'order' : 'deliver'}`, { timeout: 1_000 })
    router.push(`/${route.params.id}/requests`)
  }
}
</script>

<template>
  <VForm @submit.prevent="onSubmit">
    <MyFormWrapper controls-create :is-valid="!v.$invalid">
      <VTextField
        v-model="form.cityFrom"
        hide-details="auto"
        label="City from"
        :error-messages="v.cityFrom.$errors.map(er => er.$message)"
        autofocus
        @change="v.cityFrom.$touch()"
      />
      <VTextField
        v-model="form.cityTo"
        hide-details="auto"
        label="City to"
        :error-messages="v.cityTo.$errors.map(er => er.$message)"
        @change="v.cityTo.$touch()"
      />
      <VSelect
        v-if="isOrder"
        v-model="form.type"
        :items="selectData"
        label="Choose type"
      />
      <VueDatePicker
        v-model="form.date"
        auto-apply
        prevent-min-max-navigation
        :min-date="minCalendarDate"
      />
      <VTextarea
        v-if="isOrder"
        v-model="form.description"
        clearable
        label="Details"
      />
    </MyFormWrapper>
  </VForm>
</template>
