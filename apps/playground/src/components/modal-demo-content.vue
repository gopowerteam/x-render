<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'
// 自引用：用于嵌套弹窗演示
import ModalDemoContent from './modal-demo-content.vue'

defineProps<{
  content?: string
}>()

const modal = useModal()

function onCloseWithData() {
  modal.close({ message: '来自弹窗内容的数据', timestamp: Date.now() })
}

function onCloseWithoutData() {
  // 未携带数据关闭时，外层 Promise 永远挂起，then 不会触发
  modal.close()
}

function onOpenNested() {
  modal.open(ModalDemoContent, { content: '这是嵌套打开的第二层弹窗，可以继续向下嵌套。' }, {
    title: '嵌套弹窗',
    footer: true,
    onOk({ close }) {
      close()
    },
  })
}
</script>

<template>
  <div class="modal-demo-content">
    <p class="content-text">
      {{ content || '弹窗内容组件示例' }}
    </p>
    <ASpace wrap>
      <AButton type="primary" size="small" @click="onCloseWithData">
        关闭并回传数据
      </AButton>
      <AButton size="small" @click="onCloseWithoutData">
        直接关闭（不回传）
      </AButton>
      <AButton type="outline" size="small" @click="onOpenNested">
        打开嵌套弹窗
      </AButton>
    </ASpace>
  </div>
</template>

<style scoped>
.modal-demo-content {
  padding: 8px;
}

.content-text {
  margin: 0 0 12px;
  color: var(--color-text-2, #4e5969);
}
</style>
