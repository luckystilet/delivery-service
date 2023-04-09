<script lang="ts" setup>
const props = defineProps({
  controlsCreate: { type: Boolean },
  isValid: { type: Boolean, default: true },
})
</script>

<template>
  <div class="my-form">
    <slot />
    <div
      v-if="$slots.controls || controlsCreate"
      class="my-form__controls"
    >
      <VBtn
        v-if="controlsCreate"
        prepend-icon="mdi-creation"
        type="submit"
        block
        :disabled="!isValid"
      >
        Create
      </VBtn>
      <slot name="controls" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 500px;
  &__controls {
    display: flex;
    margin-top: 20px;
  }
}
</style>
