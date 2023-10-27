<template>
  <ModalProvider append-to-body>
    <UseModalContainer v-bind="props" />
  </ModalProvider>
</template>

<style scoped>

</style>

<script setup lang="tsx">
import '@gopowerteam/modal-render/dist/style.css'
import type { OpenModalOptions } from '@gopowerteam/modal-render'
import { ModalProvider } from '@gopowerteam/modal-render'
import UseModalContainer from './use-modal-container.vue'

const props = defineProps<OpenModalOptions>()
</script>
