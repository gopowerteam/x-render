<template>
  <div
    ref="wrapperRef"
    class="modal-wrapper"
    :style="wrapperStyle"
    @click.self="maskClosable && onClose()"
  >
    <div
      ref="contentRef"
      class="modal-content"
      :class="{ [`${mode}-mode`]: true }"
      :style="contentStyle"
    >
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
      <div v-if="loading" class="modal-loading">
        <div class="lds-ring">
          <div />
          <div />
          <div />
          <div />
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
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
}

.modal-content {
    background: rgb(255, 255, 255);
    border-radius: 5px;
    position: relative;
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

.modal-loading{
  position: absolute;
  z-index: 1001;
  inset:0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 48px;
    height: 48px;
    margin: 8px;
    border: 5px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
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
  ref,
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
  size: 'small' | 'middle' | 'large'
  fullscreen?: boolean
  title?: string
  header?: boolean
  footer?: boolean
  closeable?: boolean
  esc?: boolean
  maskClosable?: boolean
  draggable?: boolean
  mode?: 'dialog' | 'drawer'
  type?: string
  offset?: { x?: number; y?: number }
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
  mode: 'dialog',
})
const emits = defineEmits(['submit'])
const modal = inject(ModalKey)
const loading = ref(false)

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

const wrapperStyle = computed(() => {
  const styles: CSSProperties = {}

  if (props.mode === 'dialog') {
    styles.justifyContent = 'center'
  }

  if (props.mode === 'drawer') {
    styles.justifyContent = 'flex-end'
  }

  return styles
})

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

  if (props.fullscreen) {
    styles.maxWidth = 'unset'
    styles.width = '100%'
    styles.position = 'fixed'
    styles.top = 0
    styles.left = 0
    styles.bottom = 0
    styles.right = 0
    styles.borderRadius = 0
  }

  if (props.draggable && !props.fullscreen && props.mode === 'dialog') {
    styles.transform = `translate3d(${x.value - offsetX}px, ${y.value - offsetY}px, 0px)`
  }

  if (props.mode === 'drawer') {
    styles.borderRadius = 0
  }

  if (props.offset && props.mode === 'dialog') {
    styles.marginLeft = `${props.offset.x || 0}px`
    styles.marginTop = `${props.offset.y || 0}px`
  }

  return styles
})

const headerStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties = {}

  if (props.draggable && !props.fullscreen && props.mode === 'dialog') {
    styles.cursor = 'move'
  }

  return styles
})

const bodyStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties = {}

  if (props.maxHeight) {
    styles.maxHeight = `calc(${formatSizeValue(props.maxHeight)?.replace('%', 'vh')} - 50px)`
  }

  if (props.mode === 'drawer') {
    styles.maxHeight = 'unset'
    styles.height = `calc(100vh - ${(props.header ? 50 : 0) + (props.footer ? 50 : 0)}px)`
  }

  if (props.fullscreen) {
    styles.maxHeight = 'unset'
    styles.height = `calc(100vh - ${(props.header ? 50 : 0) + (props.footer ? 50 : 0)}px)`
  }

  if (props.type !== 'component') {
    styles.padding = '0'
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

      if (contentRef.value) {
        offsetX = contentRef.value.offsetLeft
        offsetY = contentRef.value.offsetTop
      }
    })
  }
}

function onKeyboard() {
  if (props.closeable && props.esc) {
    const handleEsc = ({ key }: { key: string }) => {
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

function showLoading() {
  loading.value = true
  return () => hideLoading()
}

function hideLoading() {
  loading.value = false
}

defineExpose({
  showLoading,
  hideLoading,
})
</script>

<script lang="ts">
export default {
  name: 'ModalContainer',
  inheritAttrs: true,
}
</script>
