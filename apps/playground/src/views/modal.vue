<template>
  <div>123123123</div>
  <button @click="onClick">
    12312
  </button>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'
import Test1 from '../components/test1.vue'

const modal = useModal()

function onClick() {
  modal
    .open(Test1, { msg: '123' }, {
      title: 'aaa11',
      size: 'large',
      maskClosable: false,
      footer: true,
      esc: true,
    })
    .then((a: any) => {
      console.log(a)
    })
}
</script>
