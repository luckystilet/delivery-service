<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Id',
  beforeCreate() {
    this.$router.push(`${this.$route.params.id}/requests`)
  },
})
</script>
<template>
  <div>
    dummy template to get rid of warning
  </div>
</template>
