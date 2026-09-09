<script setup lang="ts">
import { computed } from 'vue'
// 直接从 hooks 导入，避免经由包入口形成循环依赖（index → container → dialog → index）
import { useModal } from '../hooks/use-modal'

const props = withDefaults(
  defineProps<{
    type: 'confirm' | 'success' | 'error' | 'warning' | 'info'
    title?: string
    content: string
    okText?: string
    cancelText?: string
    onOk?: () => Promise<void> | void
    onCancel?: () => Promise<void> | void
    footer?: () => JSX.Element
  }>(),
  {
    okText: '确定',
    cancelText: '取消',
  },
)

const modal = useModal()

const headerTitle = computed(() => {
  if (props.title) {
    return props.title
  }

  return {
    confirm: '提示',
    info: '提示',
    warning: '警告',
    error: '错误',
    success: '成功',
  }[props.type]
})

async function onClickOk() {
  if (props.onOk) {
    await props.onOk()
  }

  modal.close()
}

async function onClickCancel() {
  if (props.onCancel) {
    await props.onCancel()
  }

  modal.close()
}
</script>

<template>
  <section class="modal-dialog">
    <div class="dialog-body">
      <div class="dialog-title">
        {{ headerTitle }}
      </div>
      <div class="dialog-content">
        {{ content }}
      </div>
    </div>
    <div class="dialog-footer space-x-2" :style="type === 'confirm' ? { 'justify-content': 'end' } : { 'border-top': 'none' }">
      <template v-if="footer">
        <component :is="footer" />
      </template>
      <template v-else>
        <button
          class="submit-button"
          type="button"
          @click="onClickOk"
        >
          {{ okText }}
        </button>
        <button
          v-if="type === 'confirm'"
          class="cancel-button"
          type="button"
          @click="onClickCancel"
        >
          {{ cancelText }}
        </button>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use './styles/modal-buttons' as *;

.dialog-body {
  padding: 20px 10px 10px 10px;
}
.dialog-title {
  padding: 5px;
  font-weight: bold;
  font-size: 16px;
}
.dialog-content {
  padding: 5px;
}
.dialog-footer {
  box-sizing: border-box;
  height: 50px;
  border-top: solid 1px var(--color-border-1, rgb(232, 232, 232));
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;

  @include modal-buttons;
}
</style>
