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
import Test1 from '../components/test1.vue'

const modal = useModal()

function onClick() {
  const instance = modal.open(Test1, {
    content: 'asdasd',
  }, {
    mode: 'dialog',
    title: 'asdasd',
    footer: true,
    submitText: '123',
    bodyStyle: {
      padding: '100px',
    },
  })

  instance.then((a: any) => {
    console.log(a)
  })
}
</script>
