<template>
  <div>123123123</div>
  <button @click="onClick">
    12312
  </button>
</template>

<style scoped>

</style>

<script setup lang="tsx">
import { useModal } from '@gopowerteam/modal-render'

const modal = useModal()

function onClick() {
  const instance = modal.open('confirm', {
    content: 'asdasd',

  })

  instance.then((a: any) => {
    console.log(a)
  })
}
</script>
