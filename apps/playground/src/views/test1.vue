<template>
  <AButton type="primary" @click="onOpen">
    open
  </AButton>
</template>

<style scoped></style>

<script setup lang="tsx">
import { useModal } from '@gopowerteam/modal-render'
import Test2 from '../components/test2.vue'

const modal = useModal()
function onOpen() {
  modal.open(Test2, {}, { footer: true })
}
</script>
