<template>
  <div v-for="i in 1000" key="i">
    test-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxx
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { onSubmit } from '@gopowerteam/modal-render'

onSubmit(() => {
  console.log('zhuchentong')
})
</script>
