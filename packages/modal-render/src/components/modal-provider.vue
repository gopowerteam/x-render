<template>
  <slot />

  <div v-if="clientMounted" class="modal-teleport">
    <teleport :disabled="!appendToBody" to="body">
      <transition-group name="modal-fade">
        <ModalContainer
          v-for="(modal) in elements"
          :id="modal.id"
          :key="modal.id"
          :closable="modal.options.closable"
          :component="modal.component"
          :component-props="modal.props"
          :mask-closable="modal.options.maskClosable"
          :max-width="maxWidth"
          :size="modal.options.size"
          :sizes="sizes"
          :title="modal.options.title"
          :width="modal.options.width"
        />
      </transition-group>
    </teleport>
  </div>
</template>

<style lang="less" scoped>
  .modal-fade-enter-active,
  .modal-fade-leave-active{
    transition: all 0.5s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to{
    opacity: 0;
  }
  </style>

<script setup lang="ts">
import type { Component } from 'vue'
import {
  defineAsyncComponent,
  defineProps,
  onMounted,
  provide,
  ref,
  shallowRef,
  triggerRef,
} from 'vue'
import { ModalKey } from '../constants'
import type { ModalElement, OpenModalOptions, SizeOptions } from '../interfaces'
import ModalContainer from './modal-container.vue'

withDefaults(defineProps<{
  appendToBody: boolean
  sizes: SizeOptions
  maxWidth: string | number
}>(), {
  appendToBody: false,
  maxWidth: '80%',
  sizes: () => ({
    small: 520,
    middle: 860,
    large: 1190,
  }),
})

// modal列表
const elements = shallowRef<ModalElement[]>([])
// 处理SSR错误
const clientMounted = ref<boolean>(false)

/**
 * 打开Modal
 */
async function openModal(component: Component, props: Record<string, any>, options: OpenModalOptions) {
  const instance = defineAsyncComponent(() =>
    Promise.resolve(component!),
  )

  return new Promise((resolve) => {
    elements.value.push({
      id: Math.random().toString(32).slice(2),
      component: instance,
      props,
      options,
      resolve,
    })

    triggerRef(elements)
  })
}

/**
   * 关闭Modal
   */
function closeModal(id: string, data?: any) {
  const index = elements.value.findIndex(x => x.id === id)

  if (index < 0) {
    return
  }

  const modal = elements.value[index]
  modal?.resolve(data)
  elements.value.splice(index, 1)

  triggerRef(elements)
}

function closeAllModal() {
  elements.value.forEach((modal) => {
    modal.resolve()
  })

  elements.value = []
  triggerRef(elements)
}

provide(ModalKey, {
  open: openModal,
  close: closeModal,
  closeAll: closeAllModal,
})

onMounted(() => {
  clientMounted.value = true
})
</script>
