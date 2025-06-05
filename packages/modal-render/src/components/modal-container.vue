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
      :class="{ [`${mode}-mode`]: true, [`${position}-position`]: true }"
      :style="contentStyle"
    >
      <div
        v-if="header"
        ref="headerRef"
        class="modal-header"
        :style="headerStyle"
        @mousedown="onMouseDown"
      >
        <div class="title text-16px font-bold">
          {{ title }}
        </div>
        <div class="action">
          <div v-if="closeable" class="i-icon-park-outline:close block cursor-pointer" @click="onClose" />
        </div>
      </div>
      <div id="modal-header-slot" ref="headerSlotRef" />
      <div class="modal-body" :style="bodyStyle">
        <Component :is="component" v-bind="componentProps" />
      </div>
      <div id="modal-footer-slot" ref="footerSlotRef" />
      <div v-if="footer" ref="footerRef" class="modal-footer space-x-2">
        <button class="cancel-button" type="button" @click="onCancelClick">
          {{ cancelText }}
        </button>
        <button
          class="submit-button"
          :form="form"
          type="button"
          @click="onSubmitClick"
        >
          {{ submitText }}
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
  z-index: v-bind(zIndex);
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
    align-items:center;
    border-bottom: solid 1px var(--color-border-1, rgb(232, 232, 232));
    color: var(--color-text-2, #4E5969);
}

.modal-body{
  padding: 10px 10px;
  box-sizing: border-box;
  overflow: auto;
  position: relative;
}

.modal-footer{
  box-sizing: border-box;
  height: 50px;
  border-top: solid 1px var(--color-border-1, rgb(232, 232, 232));
  display: flex;
  justify-content: flex-end;
  padding: 10px;

  button{
    height: 32px;
    line-height: 28px;
    min-width: 80px;
    outline: none;
    border-color: transparent;
    font-size: 14px;
    border-radius: 4px;
    padding: 0 10px;
    box-sizing: border-box;

    &.submit-button{
      color: #fff;
      background-color: rgb(var(--primary-6, 45, 106, 251));

      &:hover{
        background-color: rgb(var(--primary-5, 28, 76, 207));
      }
      &:active{
        background-color: rgb(var(--primary-7, 14,66,210));
      }
    }
    &.cancel-button{
      color: rgb(var(--color-text-2, 78, 89, 105));
      background-color: var(--color-fill-1, #f5f5f5);

      &:hover{
        background-color: var(--color-fill-3, #e5e6eb);
      }

      &:active{
        background-color: var(--color-fill-4, #c9cdd4);
      }
    }
  }
}

.modal-loading{
  position: absolute;
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
import { useDraggable, useElementSize } from '@vueuse/core'
import { ModalKey } from '../constants'
import type { SizeOptions } from '../interfaces'

const props = withDefaults (defineProps<{
  id: string
  form?: string
  component: Component
  componentProps: Record<string, any>
  width?: number | string
  height?: number | string
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
  position?: 'left' | 'right' | 'bottom' | 'top'
  type?: string
  offset?: { x?: number; y?: number }
  backgroundColor?: string
  bodyStyle?: CSSProperties
  submitText?: string
  cancelText?: string
  zIndex?: number
  onOk?: (options: { close: () => void }) => void
  onCancel?: () => void
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
  position: 'right',
  submitText: '确定',
  cancelText: '取消',
  maxHeight: 90,
  zIndex: 1000,
})
const emits = defineEmits(['submit'])
const modal = inject(ModalKey)
const loading = ref(false)

let offsetX = 0
let offsetY = 0
let observer: MutationObserver
const wrapperRef = shallowRef<HTMLDivElement>()
const contentRef = shallowRef<HTMLDivElement>()
const headerRef = shallowRef<HTMLDivElement>()
const footerRef = shallowRef<HTMLDivElement>()
const headerSlotRef = shallowRef<HTMLDivElement>()
const footerSlotRef = shallowRef<HTMLDivElement>()
const { height: wrapperHeight } = useElementSize(wrapperRef)
// const { height: contentHeight } = useElementSize(contentRef)
const { height: headerHeight } = useElementSize(headerRef, undefined, { box: 'border-box' })
const { height: footerHeight } = useElementSize(footerRef, undefined, { box: 'border-box' })
const { height: headerSlotHeight } = useElementSize(headerSlotRef)
const { height: footerSlotHeight } = useElementSize(footerSlotRef)

const { x, y } = useDraggable(headerRef, {
  initialValue: { x: 0, y: 0 },
})

function onClose() {
  modal?.close(props.id)
}

function formatSizeValue(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`
  }
  else {
    return value
  }
}

const wrapperStyle = computed(() => {
  const styles: CSSProperties = {}

  if (props.mode === 'dialog') {
    styles.justifyContent = 'center'
  }

  if (props.mode === 'drawer') {
    styles.justifyContent = ({
      left: 'flex-start',
      right: 'flex-end',
      top: 'flex-start',
      bottom: 'flex-end',
    }[props.position]) as 'flex-start' | 'flex-end'

    styles.flexDirection = ({
      left: 'row',
      right: 'row',
      top: 'column',
      bottom: 'column',
    }[props.position]) as 'row' | 'column'
  }

  return styles
})

/**
 * 获取容器样式
 */
const contentStyle = computed(() => {
  const styles: HTMLAttributes['style'] = {}

  if (props.mode === 'drawer' && ['top', 'bottom'].includes(props.position)) {
    // styles.height = formatSizeValue(props.sizes[props.size])
    styles.maxHeight = formatSizeValue(props.maxHeight!)
  }
  else {
    styles.width = formatSizeValue(props.sizes[props.size])
    styles.maxWidth = formatSizeValue(props.maxWidth!)
  }

  if (props.width) {
    styles.width = formatSizeValue(props.width)
  }

  if (props.height) {
    styles.height = formatSizeValue(props.height)
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
    if (['left', 'right'].includes(props.position)) {
      styles.height = '100%'
    }
    else {
      styles.width = '100%'
    }
  }

  if (props.offset && props.mode === 'dialog') {
    styles.marginLeft = `${props.offset.x || 0}px`
    styles.marginTop = `${props.offset.y || 0}px`
  }

  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
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
  const extraHeight = headerSlotHeight.value + footerSlotHeight.value + headerHeight.value + footerHeight.value
  const containerMaxHeight = Math.floor(wrapperHeight.value * (Number(formatSizeValue(props.maxHeight).replace('%', '')) / 100))

  if (props.maxHeight) {
    styles.maxHeight = `${containerMaxHeight - extraHeight}px`
  }

  if (props.mode === 'drawer') {
    styles.maxHeight = 'unset'

    if (['left', 'right'].includes(props.position)) {
      styles.height = `${wrapperHeight.value - extraHeight}px`
    }
  }

  if (props.fullscreen) {
    styles.maxHeight = 'unset'
    styles.height = `calc(100% - ${extraHeight}px)`
  }

  if (props.type !== 'component') {
    styles.padding = '0'
  }

  if (props.bodyStyle) {
    Object.assign(styles, props.bodyStyle)
  }

  return styles
})

function onSubmitClick() {
  const content = contentRef.value as HTMLDivElement

  if (props.form && content) {
    const form = content.querySelector(`form[name="${props.form}"]`) as HTMLFormElement

    if (form) {
      form.dispatchEvent(new Event('submit'))
    }
  }

  if (props.onOk) {
    props.onOk({
      close: () => modal?.close(props.id),
    })
  }

  emits('submit')
}

function onCancelClick() {
  modal?.close(props.id)

  if (props?.onCancel) {
    props.onCancel()
  }
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
  offsetX = contentRef.value!.offsetLeft
  offsetY = contentRef.value!.offsetTop
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
  inheritAttrs: false,
}
</script>
