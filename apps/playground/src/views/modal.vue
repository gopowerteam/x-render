<template>
  <div>123123123</div>
  <button @click="onClick">
    12312
  </button>

  <button @click="onShowLoading">
    showLoading
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
    position: 'right',
    title: 'asdasd',
    footer: true,
    submitText: '1231231231239871928739123',
    onOk({ close }) {
      console.log('ok')
      close()
    },
    onCancel() {
      console.log('cancel')
    },
    bodyStyle: {
      // padding: '100px',
    },
  })

  instance.then((a: any) => {
    console.log(a)
  })
}

function onShowLoading() {
  const a = modal.showLoading({
    text: 'test221',
  })
  setTimeout(() => {
    a()
  }, 3000)
}
</script>
