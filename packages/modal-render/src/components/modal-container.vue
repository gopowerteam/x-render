<template>
  <div class="modal-container">
    <div
      ref="wrapperRef"
      class="modal-wrapper"
      @click.self="maskClosable && onClose()"
    >
      <div ref="contentRef" class="modal-content" :style="contentStyle">
        <div
          v-if="header"
          ref="headerRef"
          class="modal-header"
          :style="headerStyle"
          @mousedown="onMouseDown"
        >
          <div class="title font-bold">
            {{ title }}
          </div>
          <div class="action">
            <div v-if="closeable" class="i-icon-park-outline:close block cursor-pointer" @click="onClose" />
          </div>
        </div>
        <div class="modal-body" :style="bodyStyle">
          <Component :is="component" v-bind="componentProps" />
        </div>
        <div v-if="footer" class="modal-footer space-x-2">
          <button
            class="submit-button"
            :form="form"
            type="submit"
            @click="onSubmit"
          >
            确定
          </button>
          <button class="cancel-button" type="button" @click="onCancel">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.modal-wrapper {
  z-index: 1000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
}

.modal-content {
    background: rgb(255, 255, 255);
    border-radius: 5px;
}

.modal-header {
    box-sizing: border-box;
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px var(--color-border-1, rgb(232, 232, 232));
}

.modal-body{
  padding: 20px 10px;
  box-sizing: border-box;
  max-height: 10vw;
  overflow: auto;
}

.modal-footer{
  box-sizing: border-box;
  height: 50px;
  border-top: solid 1px var(--color-border-1, rgb(232, 232, 232));
  display: flex;
  justify-content: end;
  padding: 10px;

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
import type { CSSProperties, Component, HTMLAttributes } from 'vue'
import {
  computed,
  defineProps,
  inject,
  onMounted,
  onUnmounted,
  shallowRef,
  triggerRef,
} from 'vue'
import { useDraggable } from '@vueuse/core'
import { ModalKey } from '../constants'
import type { SizeOptions } from '../interfaces'

const props = withDefaults (defineProps<{
  id: string
  form?: string
  component: Component
  componentProps: Record<string, any>
  width?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  sizes: SizeOptions
  size: 'small' | 'middle' | 'large' | 'fullscreen'
  title?: string
  header?: boolean
  footer?: boolean
  closeable?: boolean
  esc?: boolean
  maskClosable?: boolean
  draggable?: boolean
}>()
, {
  header: true,
  closeable: true,
  footer: false,
  keyboard: false,
  maskClosable: false,
  size: 'middle',
  esc: false,
  draggable: false,
})
const emits = defineEmits(['submit'])
const modal = inject(ModalKey)

let offsetX = 0
let offsetY = 0
let observer: MutationObserver
const wrapperRef = shallowRef<any>()
const contentRef = shallowRef<any>()
const headerRef = shallowRef<any>()
const { x, y } = useDraggable(headerRef, {
  initialValue: { x: 0, y: 0 },
})

function onClose() {
  modal?.close(props.id)
}

function formatSizeValue(value: string | number | undefined): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`
  }

  if (typeof value === 'string') {
    return value
  }
}

/**
 * 获取容器样式
 */
const contentStyle = computed(() => {
  const styles: HTMLAttributes['style'] = {}

  if (props.size) {
    styles.width = formatSizeValue(props.sizes[props.size])
  }

  if (props.width) {
    styles.width = formatSizeValue(props.width)
  }

  if (props.maxWidth) {
    styles.maxWidth = formatSizeValue(props.maxWidth)
  }

  if (props.size === 'fullscreen') {
    styles.maxWidth = 'unset'
    styles.position = 'fixed'
    styles.top = 0
    styles.left = 0
    styles.bottom = 0
    styles.right = 0
  }

  if (props.draggable && props.size !== 'fullscreen') {
    styles.transform = `translate(${x.value - offsetX}px, ${y.value - offsetY}px)`
  }

  return styles
})

const headerStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties = {}

  if (props.draggable && props.size !== 'fullscreen') {
    styles.cursor = 'move'
  }

  return styles
})

const bodyStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties = {}

  if (props.maxHeight) {
    styles.maxHeight = `calc(${formatSizeValue(props.maxWidth)?.replace('%', 'vh')} - 50px)`
  }

  if (props.size === 'fullscreen') {
    styles.maxHeight = 'calc(100% - 50px)'
  }

  return styles
})

function onSubmit() {
  const content = contentRef.value as HTMLDivElement

  if (props.form && content) {
    const form = content.querySelector(`form[name="${props.form}"]`) as HTMLFormElement

    if (form) {
      form.dispatchEvent(new Event('submit'))
    }
  }

  emits('submit')
}

function onCancel() {
  modal?.close(props.id)
}

function onResize() {
  if (window) {
    window.addEventListener('resize', () => {
      triggerRef(wrapperRef)
      triggerRef(contentRef)

      offsetX = contentRef.value.offsetLeft
      offsetY = contentRef.value.offsetTop
    })
  }
}

function onKeyboard() {
  if (props.closeable && props.esc) {
    const handleEsc = ({ key }) => {
      if (key === 'Escape') {
        modal?.close(props.id)
        window.removeEventListener('keydown', handleEsc)
      }
    }

    window.addEventListener('keydown', handleEsc)
  }
}

function onMouseDown() {
  offsetX = contentRef.value.offsetLeft
  offsetY = contentRef.value.offsetTop
}

onMounted(() => {
  onKeyboard()
  onResize()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer.takeRecords()
  }
})
</script>

<script lang="ts">
export default {
  name: 'ModalContainer',
  inheritAttrs: true,
}
</script>
