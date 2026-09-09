<script setup lang="ts">
import type { Component } from 'vue'
import type { useModal } from '../hooks/use-modal'
import type {
  ModalElement,
  OpenModalOptions,
  ShowLoadingOptions,
  SizeOptions,
} from '../interfaces'
import {
  getCurrentInstance,
  onMounted,
  provide,
  ref,
  shallowRef,
  triggerRef,
} from 'vue'
import { ModalKey } from '../constants'
import ModalContainer from './modal-container.vue'
import ModalDialog from './modal-dialog.vue'
import ModalLoading from './modal-loading.vue'

withDefaults(
  defineProps<{
    appendToBody?: boolean | string
    sizes?: SizeOptions
    maxWidth?: string | number
    maxHeight?: string | number
    offset?: { x?: number, y?: number }
    mobile?: boolean | 'auto'
  }>(),
  {
    appendToBody: false,
    maxWidth: '90%',
    maxHeight: '90%',
    sizes: () => ({
      small: '50%',
      middle: '70%',
      large: '90%',
    }),
    offset: () => ({ x: 0, y: 0 }),
    mobile: 'auto',
  },
)

// modal列表
const elements = shallowRef<ModalElement[]>([])
// 全局 Loading 关闭函数表（键：容器 id 或 '__global__'），供 hideLoading 兜底关闭
const globalLoadingClosers = new Map<string, () => void>()
// 处理SSR错误
const clientMounted = ref<boolean>(false)
const instance = getCurrentInstance()

/**
 * 打开Modal
 */
function openModal(
  component: Component | 'confirm' | 'info' | 'warning' | 'error' | 'success',
  props: Record<string, any> = {},
  options: OpenModalOptions = {},
) {
  const modalComponent = typeof component === 'string' ? ModalDialog : component

  // 拷贝入参，避免污染调用方对象
  const elementProps = { ...props }

  if (typeof component === 'string') {
    elementProps.type = component
  }

  // zIndex 固定 1000：叠加弹窗的层叠关系由 DOM 顺序保证（transition-group 按 elements 数组顺序渲染，后开者靠后、自然覆盖先开者）。
  // arco 弹层（如 ASelect 下拉）z-index 从 1001 起自增，恒高于弹窗本体，避免弹窗覆盖弹窗内弹层；显式传入 zIndex 时可覆盖。
  const elementOptions = Object.assign(
    {
      zIndex: 1000,
    },
    options,
  )

  if (typeof component === 'string') {
    elementOptions.size = 'small'
    elementOptions.fullscreen = false
    elementOptions.mode = 'dialog'
    elementOptions.footer = false
    elementOptions.header = false
  }

  const id = `modal_${++modalIdCounter}`

  const promise = new Promise((resolve, reject) => {
    elements.value.push({
      id,
      component: modalComponent,
      props: elementProps,
      options: {
        ...elementOptions,
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

  // 同一事件可能注册多个监听器，全部触发
  element.listeners
    .filter(x => x.event === event)
    .forEach(listener =>
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
      }),
    )
}

function showModalLoading(id?: string, options?: ShowLoadingOptions) {
  if (!instance) {
    return
  }

  const [container] = (instance.refs[`modal-container_${id}`] || []) as any[]

  if (container) {
    return container.showLoading()
  }
  else {
    const key = id ?? '__global__'
    const { close } = openModal(
      ModalLoading,
      {
        text: options?.text,
      },
      {
        footer: false,
        header: false,
        closeable: false,
        backgroundColor: 'transparent',
      },
    )

    // 记录关闭函数，供 hideLoading 在无容器场景下兜底关闭
    globalLoadingClosers.set(key, close)

    if (options?.duration) {
      setTimeout(() => {
        close()

        if (globalLoadingClosers.get(key) === close) {
          globalLoadingClosers.delete(key)
        }
      }, options?.duration)
    }

    return close
  }
}

function hideModalLoading(id?: string) {
  if (!instance) {
    return
  }

  const [container] = (instance.refs[`modal-container_${id}`] || []) as any[]

  if (container) {
    return container.hideLoading()
  }
  else {
    // 容器不存在时兜底关闭全局 Loading 弹窗
    const key = id ?? '__global__'
    const close = globalLoadingClosers.get(key)

    if (close) {
      globalLoadingClosers.delete(key)
      close()
    }
  }
}

function addEventListener(
  id: string,
  event: string,
  callback: (actions: ReturnType<typeof useModal>) => void,
) {
  const element = elements.value.find(element => element.id === id)

  // 同一事件 + 同一回调去重，避免重复注册
  if (
    element
    && !element.listeners.some(x => x.event === event && x.callback === callback)
  ) {
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
  showLoading: showModalLoading,
  hideLoading: hideModalLoading,
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
// 弹窗自增 ID 计数器（模块级，跨 Provider 实例保证唯一）
let modalIdCounter = 0

export default {
  name: 'ModalProvider',
  inheritAttrs: false,
}
</script>

<template>
  <slot />

  <div v-if="clientMounted" class="modal-teleport">
    <teleport
      :disabled="!appendToBody"
      :to="typeof appendToBody === 'string' ? appendToBody : 'body'"
    >
      <transition-group name="modal-fade">
        <ModalContainer
          v-for="modal in elements"
          :id="modal.id"
          :key="modal.id"
          :ref="`modal-container_${modal.id}`"
          :component="modal.component"
          :component-props="modal.props"
          :max-height="maxHeight"
          :max-width="maxWidth"
          :offset="offset"
          :sizes="sizes"
          :mobile="mobile"
          v-bind="modal.options"
          @submit="() => onEvent(modal.id, 'submit')"
        />
      </transition-group>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;

  &:deep(.modal-content.drawer-mode) {
    transition: transform 0.5s ease;
  }
  &:deep(.modal-content.dialog-mode.modal--bottom-sheet) {
    transition: transform 0.3s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  &:deep(.modal-content.drawer-mode.left-position) {
    transform: translate3d(-100%, 0, 0);
  }
  &:deep(.modal-content.drawer-mode.right-position) {
    transform: translate3d(100%, 0, 0);
  }
  &:deep(.modal-content.drawer-mode.top-position) {
    transform: translate3d(0, -100%, 0);
  }
  &:deep(.modal-content.drawer-mode.bottom-position) {
    transform: translate3d(0, 100%, 0);
  }
  &:deep(.modal-content.dialog-mode.modal--bottom-sheet) {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
