<template>
  <slot />

  <div v-if="clientMounted" class="modal-teleport">
    <teleport :disabled="!appendToBody" :to="typeof appendToBody === 'string' ? appendToBody : 'body'">
      <transition-group name="modal-fade">
        <ModalContainer
          v-for="(modal) in elements"
          :id="modal.id"
          :key="modal.id"
          :ref="`modal-container_${modal.id}`"
          :component="modal.component"
          :component-props="modal.props"
          :max-height="maxHeight"
          :max-width="maxWidth"
          :offset="offset"
          :sizes="sizes"
          v-bind="modal.options"
          @submit="() => onEvent(modal.id, 'submit')"
        />
      </transition-group>
    </teleport>
  </div>
</template>

<style lang="less" scoped>
.modal-fade-enter-active,
  .modal-fade-leave-active{
    transition: opacity 0.5s ease;

    &:deep(.modal-content.drawer-mode){
      transition: transform 0.5s ease;
    }
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to{
    opacity: 0;

    &:deep(.modal-content.drawer-mode){
      transform: translate3d(100%,0,0);
    }
  }
  </style>

<script setup lang="ts">
import type { Component } from 'vue'
import {
  defineAsyncComponent,
  defineProps,
  getCurrentInstance,
  onMounted,
  provide,
  ref,
  shallowRef,
  triggerRef,
} from 'vue'
import { ModalKey } from '../constants'
import type { ModalElement, OpenModalOptions, SizeOptions } from '../interfaces'
import type { useModal } from '../hooks/use-modal'
import ModalContainer from './modal-container.vue'
import ModalDialog from './modal-dialog.vue'

withDefaults(defineProps<{
  appendToBody: boolean | string
  sizes: SizeOptions
  maxWidth: string | number
  maxHeight: string | number
  offset?: { x?: number; y?: number }
}>(), {
  appendToBody: false,
  maxWidth: '90%',
  maxHeight: '90%',
  sizes: () => ({
    small: 520,
    middle: 860,
    large: 1190,
  }),
  offset: () => ({ x: 0, y: 0 }),
})

// modal列表
const elements = shallowRef<ModalElement[]>([])
// 处理SSR错误
const clientMounted = ref<boolean>(false)
const instance = getCurrentInstance()
let zIndex = 1100
/**
 * 打开Modal
 */

function openModal(component: Component | 'confirm' | 'info' | 'warning' | 'error' | 'success', props: Record<string, any> = {}, options: OpenModalOptions = {}) {
  const instance = defineAsyncComponent(() =>
    Promise.resolve(typeof component === 'string' ? ModalDialog : component),
  )

  if (typeof component === 'string') {
    props.type = component
    options.size = 'small'
    options.fullscreen = false
    options.mode = 'dialog'
    options.footer = false
    options.header = false
  }

  const id = Math.random().toString(32).slice(2)

  const elementProps = Object.assign({ zIndex: zIndex++ }, props)

  const promise = new Promise((resolve, reject) => {
    elements.value.push({
      id,
      component: instance,
      props: props || {},
      options: {
        ...elementProps,
        type: typeof component === 'string' ? component : 'component',
      },
      resolve,
      reject,
      listeners: [],
    })

    triggerRef(elements)
  }).catch((e) => {
    if (e === 'CANCEL') {
      return new Promise(() => {})
    }
    else {
      return Promise.reject(e)
    }
  })

  return Object.assign(promise, {
    close: () => closeModal(id),
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

  if (data === undefined) {
    modal?.reject('CANCEL')
  }
  else {
    modal?.resolve(data)
  }

  elements.value.splice(index, 1)

  triggerRef(elements)
}

function closeAllModal() {
  if (!elements.value || elements.value.length === 0) {
    return
  }

  elements.value.forEach((modal) => {
    modal?.reject('CANCEL')
  })

  elements.value = []
  triggerRef(elements)
}

function onEvent(id: string, event: string) {
  const element = elements.value.find(element => element.id === id)

  if (!element) {
    return
  }

  const listener = element.listeners.find(x => x.event === event)

  if (listener) {
    listener.callback({
      open: openModal,
      close: (data?: any) => closeModal(element.id, data),
      closeAll: closeAllModal,
      showLoading: () => showModalLoading(element.id),
      hideLoading: () => hideModalLoading(element.id),
      confirm: options => openModal('confirm', options),
      success: options => openModal('success', options),
      error: options => openModal('error', options),
      warning: options => openModal('warning', options),
      info: options => openModal('info', options),
    })
  }
}

function showModalLoading(id: string) {
  if (!instance) {
    return
  }

  const [container] = instance.refs[`modal-container_${id}`] as any[]

  if (container) {
    return container.showLoading()
  }
}

function hideModalLoading(id: string) {
  if (!instance) {
    return
  }

  const [container] = instance.refs[`modal-container_${id}`] as any[]

  if (container) {
    return container.hideLoading()
  }
}

function addEventListener(id: string, event: string, callback: (actions: ReturnType<typeof useModal>) => void) {
  const element = elements.value.find(element => element.id === id)

  if (element) {
    element.listeners.push({
      event,
      callback,
    })
  }
}

provide(ModalKey, {
  open: openModal,
  close: closeModal,
  closeAll: closeAllModal,
  addEventListener,
})

defineExpose({
  elements,
  open: openModal,
  close: closeModal,
  closeAll: closeAllModal,
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
