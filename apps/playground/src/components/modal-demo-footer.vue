<script setup lang="ts">
import { ModalFooter, useModal } from '@gopowerteam/modal-render'
// 自引用：用于嵌套弹窗 + ModalFooter 锚点唯一化验证
import ModalDemoFooter from './modal-demo-footer.vue'

defineProps<{
  content?: string
}>()

const modal = useModal()

function onSave() {
  modal.close({ source: 'ModalFooter 保存按钮' })
}

function onCancel() {
  // 未携带数据关闭时，外层 Promise 永远挂起（既有设计）
  modal.close()
}

function onOpenNested() {
  modal.open(ModalDemoFooter, { content: '第二层弹窗同样使用 ModalFooter，底部按钮应出现在各自的弹窗内（验证锚点唯一化）。' }, {
    title: '嵌套（自定义底部）',
  })
}
</script>

<template>
  <div class="modal-demo-footer">
    <p class="content-text">
      {{ content || '使用 ModalFooter 自定义底部的弹窗。' }}
    </p>
    <AButton type="outline" size="small" @click="onOpenNested">
      打开嵌套弹窗
    </AButton>
    <ModalFooter>
      <button class="cancel-button" type="button" @click="onCancel">
        取消
      </button>
      <button class="submit-button" type="button" @click="onSave">
        保存
      </button>
    </ModalFooter>
  </div>
</template>

<style scoped>
.modal-demo-footer {
  padding: 8px;
}

.content-text {
  margin: 0 0 12px;
  color: var(--color-text-2, #4e5969);
}
</style>
