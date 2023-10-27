<template>
  <slot />

  <div v-if="clientMounted" class="modal-teleport">
    <teleport :disabled="!appendToBody" to="body">
      <transition-group name="modal-fade">
        <ModalContainer
          v-for="(modal) in elements"
          :id="modal.id"
          :key="modal.id"
          :component="modal.component"
          :component-props="modal.props"
          :max-height="maxHeight"
          :max-width="maxWidth"
          :sizes="sizes"
          v-bind="modal.options"
          @submit="modal.onSubmit.value"
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
  maxHeight: string | number
}>(), {
  appendToBody: false,
  maxWidth: '80%',
  maxHeight: '80%',
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
      onSubmit: ref(() => {}),
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

function getModalElement(id: string) {
  return elements.value.find(element => element.id === id)
}

function addSubmitListener(id: string, fun: () => void) {
  const element = elements.value.find(element => element.id === id)

  if (element) {
    element.onSubmit.value = fun
  }
}

provide(ModalKey, {
  open: openModal,
  close: closeModal,
  closeAll: closeAllModal,
  getElement: getModalElement,
  addSubmitListener,
})

defineExpose({
  elements,
})

onMounted(() => {
  clientMounted.value = true
})
</script>

<script lang="ts">
export default {
  name: 'ModalProvider',
  inheritAttrs: true,
}
</script>
