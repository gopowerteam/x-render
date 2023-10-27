<template>
  <div>
    <button @click="onClick">
      打开弹窗
    </button>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import type { OpenModalOptions } from '@gopowerteam/modal-render'
import { useModal } from '@gopowerteam/modal-render'
import HelloWorld from './HelloWorld.vue'

const props = defineProps<OpenModalOptions>()
const modal = useModal()

function onClick() {
  modal.open(HelloWorld, {}, props)
}
</script>
