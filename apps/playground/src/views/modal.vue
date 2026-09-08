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

function onOpenDrawer() {
  modal.open(Test1, {}, {
    title: '抽屉',
    mode: 'drawer',
    position: 'right',
    footer: true,
  })
}

function onOpenConfirm() {
  modal.confirm({
    content: '确认执行该操作吗？',
    onOk() {
      console.log('ok')
    },
  })
}

function onOpenDesktopDialog() {
  modal.open(Test1, {}, {
    title: '保持桌面形态',
    mobile: false,
    footer: true,
  })
}
</script>

<template>
  <div>123123123</div>
  <button @click="onClick">
    12312
  </button>

  <button @click="onShowLoading">
    showLoading
  </button>
  <button @click="onOpenDrawer">
    抽屉
  </button>
  <button @click="onOpenConfirm">
    confirm
  </button>
  <button @click="onOpenDesktopDialog">
    禁用移动端形态
  </button>
</template>

<style scoped>

</style>
