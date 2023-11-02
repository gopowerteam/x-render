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
          type="submit"
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

<style scoped lang="less">
.dialog-body{
  padding: 20px 10px 10px 10px;
}
.dialog-title{
  padding: 5px;
  font-weight: bold;
  font-size: 16px;
}
.dialog-content{
  padding: 5px;
}
.dialog-footer{
  box-sizing: border-box;
  height: 50px;
  border-top: solid 1px var(--color-border-1, rgb(232, 232, 232));
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;

  button{
    height: 28px;
    line-height: 28px;
    width: 80px;
    outline: none;
    border-color: transparent;
    font-size: 14px;
    border-radius: 4px;
    padding: 0;
    box-sizing: content-box;

    &.submit-button{
      color: #fff;
      background-color: rgb(var(--primary-6, 45, 106, 251));

      &:hover{
        background-color: rgb(var(--primary-5, 28, 76, 207));
      }
    }
    &.cancel-button{
      color: rgb(var(--color-text-2, 78, 89, 105));
      background-color: var(--color-fill-1, #f5f5f5);

      &:hover{
        background-color: var(--color-fill-4, #c9cdd4);
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useModal } from '..'

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
  }>(), {
    okText: '确定',
    cancelText: '取消',
  })

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
