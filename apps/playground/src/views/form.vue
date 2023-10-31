<template>
  <div>form demo</div>
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
      fullscreen: true,
      maskClosable: false,
      footer: true,
      esc: true,
      draggable: true,
      form: 'form',
    })
    .then((a: any) => {
      console.log(a)
    })
}
</script>
