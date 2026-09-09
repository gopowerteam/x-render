<script setup lang="ts">
import type { MaybeComputedElementRef } from '@vueuse/core'
import type {
  Component,
  CSSProperties,
  HTMLAttributes,
  MaybeRefOrGetter,
} from 'vue'
import type { SizeOptions } from '../interfaces'
import { useDraggable, useElementSize } from '@vueuse/core'
import {
  computed,
  defineProps,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  triggerRef,
} from 'vue'
import { ModalContainerIdKey, ModalKey } from '../constants'
import { useMobile } from '../hooks/use-mobile'

const props = withDefaults(
  defineProps<{
    id: string
    form?: string
    component: Component
    componentProps: Record<string, any>
    width?: number | string
    height?: number | string
    maxWidth?: number | string
    maxHeight?: number | string
    sizes?: SizeOptions
    size?: 'small' | 'middle' | 'large'
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
    offset?: { x?: number, y?: number }
    backgroundColor?: string
    bodyStyle?: CSSProperties
    submitText?: string
    cancelText?: string
    mobile?: boolean | 'auto'
    zIndex?: number
    onOk?: (options: { close: () => void }) => void
    onCancel?: () => void
  }>(),
  {
    header: true,
    closeable: true,
    footer: false,
    maskClosable: false,
    size: 'middle',
    esc: false,
    draggable: false,
    mode: 'dialog',
    position: 'right',
    submitText: '确定',
    cancelText: '取消',
    mobile: 'auto',
    sizes: () => ({
      small: '50%',
      middle: '70%',
      large: '90%',
    }),
    maxHeight: '90%',
    zIndex: 1000,
  },
)
const emits = defineEmits(['submit'])
const modal = inject(ModalKey)

// 向内容组件（ModalHeader / ModalFooter）注入自身 id，用于 Teleport 锚点唯一化（支持嵌套弹窗）
provide(ModalContainerIdKey, props.id)
const isMobileQuery = useMobile()
const loading = ref(false)

const isMobileMode = computed(() =>
  props.mobile === 'auto' ? isMobileQuery.value : props.mobile,
)

// 移动端 bottom sheet（仅组件弹窗，消息弹窗保持居中）
const isBottomSheetMode = computed(() =>
  isMobileMode.value && props.mode === 'dialog' && props.type === 'component',
)

let offsetX = 0
let offsetY = 0
const wrapperRef = shallowRef<HTMLDivElement>()
const contentRef = shallowRef<HTMLDivElement>()
const headerRef = shallowRef<HTMLDivElement>()
const footerRef = shallowRef<HTMLDivElement>()
const headerSlotRef = shallowRef<HTMLDivElement>()
const footerSlotRef = shallowRef<HTMLDivElement>()
const { height: wrapperHeight } = useElementSize(
  wrapperRef as unknown as MaybeComputedElementRef,
)
const { height: headerHeight } = useElementSize(
  headerRef as unknown as MaybeComputedElementRef,
  undefined,
  { box: 'border-box' },
)
const { height: footerHeight } = useElementSize(
  footerRef as unknown as MaybeComputedElementRef,
  undefined,
  { box: 'border-box' },
)
const { height: headerSlotHeight } = useElementSize(
  headerSlotRef as unknown as MaybeComputedElementRef,
)
const { height: footerSlotHeight } = useElementSize(
  footerSlotRef as unknown as MaybeComputedElementRef,
)

const { x, y } = useDraggable(headerRef as unknown as MaybeRefOrGetter, {
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
    styles.justifyContent = {
      left: 'flex-start',
      right: 'flex-end',
      top: 'flex-start',
      bottom: 'flex-end',
    }[props.position] as 'flex-start' | 'flex-end'

    styles.flexDirection = {
      left: 'row',
      right: 'row',
      top: 'column',
      bottom: 'column',
    }[props.position] as 'row' | 'column'
  }

  return styles
})

/**
 * 获取容器样式
 */
const contentStyle = computed(() => {
  const styles: HTMLAttributes['style'] = {}

  if (props.mode === 'drawer' && ['top', 'bottom'].includes(props.position)) {
    styles.maxHeight = formatSizeValue(props.maxHeight!)
  }
  else if (!(isMobileMode.value && props.mode === 'dialog')) {
    // 移动端 dialog 宽度由 CSS 类控制（bottom sheet）
    styles.width = formatSizeValue(props.sizes![props.size!])
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

  if (props.draggable && !props.fullscreen && props.mode === 'dialog' && !isMobileMode.value) {
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

    // 移动端不强制全屏，仅钳制宽度，避免显式像素宽度溢出小屏视口
    if (isMobileMode.value) {
      styles.maxWidth = '100%'
    }
  }

  // 移动端消息弹窗保持居中小卡，宽度自适应
  if (isMobileMode.value && props.mode === 'dialog' && props.type !== 'component') {
    styles.width = 'min(calc(100vw - 32px), 400px)'
  }

  if (props.offset && props.mode === 'dialog' && !isMobileMode.value) {
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
  const extraHeight
    = headerSlotHeight.value
      + footerSlotHeight.value
      + headerHeight.value
      + footerHeight.value
  // maxHeight 语义：百分比字符串按容器高度折算；数字 / px 字符串直接作为像素上限
  const maxHeightPx
    = typeof props.maxHeight === 'string' && props.maxHeight.endsWith('%')
      ? Math.floor(wrapperHeight.value * (Number.parseFloat(props.maxHeight) / 100))
      : Number.parseFloat(formatSizeValue(props.maxHeight!))

  if (Number.isFinite(maxHeightPx)) {
    styles.maxHeight = `${maxHeightPx - extraHeight}px`
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
    const form = content.querySelector(
      `form[name="${props.form}"]`,
    ) as HTMLFormElement

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

function handleEsc({ key }: { key: string }) {
  if (key === 'Escape') {
    modal?.close(props.id)
  }
}

function handleResize() {
  triggerRef(wrapperRef)
  triggerRef(contentRef)

  if (contentRef.value) {
    offsetX = contentRef.value.offsetLeft
    offsetY = contentRef.value.offsetTop
  }
}

function onMouseDown() {
  offsetX = contentRef.value!.offsetLeft
  offsetY = contentRef.value!.offsetTop
}

onMounted(() => {
  if (props.closeable && props.esc) {
    window.addEventListener('keydown', handleEsc)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 成对移除监听，避免弹窗经其他途径关闭后 ESC 监听器泄漏
  window.removeEventListener('keydown', handleEsc)
  window.removeEventListener('resize', handleResize)
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

<template>
  <div
    ref="wrapperRef"
    class="modal-wrapper"
    :class="{ 'modal-wrapper--bottom-sheet': isBottomSheetMode }"
    :style="wrapperStyle"
    @click.self="maskClosable && onClose()"
  >
    <div
      ref="contentRef"
      class="modal-content"
      role="dialog"
      aria-modal="true"
      :aria-label="title || undefined"
      :class="{ [`${mode}-mode`]: true, [`${position}-position`]: true, 'modal--mobile': isMobileMode, 'modal--bottom-sheet': isBottomSheetMode }"
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
          <div
            v-if="closeable"
            class="i-icon-park-outline:close block cursor-pointer"
            role="button"
            aria-label="关闭"
            @click="onClose"
          />
        </div>
      </div>
      <div :id="`modal-header-slot_${id}`" ref="headerSlotRef" />
      <div class="modal-body" :style="bodyStyle">
        <Component :is="component" v-bind="componentProps" />
      </div>
      <div :id="`modal-footer-slot_${id}`" ref="footerSlotRef" />
      <div v-if="footer" ref="footerRef" class="modal-footer space-x-2">
        <button class="cancel-button" type="button" @click="onCancelClick">
          {{ cancelText }}
        </button>
        <button
          class="submit-button"
          :form="form"
          type="submit"
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

<style lang="scss" scoped>
@use './styles/modal-buttons' as *;
@use './styles/loading-spinner' as *;

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
  align-items: center;
  border-bottom: solid 1px var(--color-border-1, rgb(232, 232, 232));
  color: var(--color-text-2, #4e5969);
}

.modal-body {
  padding: 10px 10px;
  box-sizing: border-box;
  overflow: auto;
  position: relative;
}

.modal-footer {
  box-sizing: border-box;
  height: 50px;
  border-top: solid 1px var(--color-border-1, rgb(232, 232, 232));
  display: flex;
  justify-content: flex-end;
  padding: 10px;

  @include modal-buttons;
}

.modal-loading {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);

  @include loading-spinner;
}

// 移动端适配
.modal-wrapper--bottom-sheet {
  align-items: flex-end;
}

// 触控目标优化：按钮高度 44px
.modal-content.modal--mobile {
  .modal-footer button {
    height: 44px;
    line-height: 44px;
  }

  :deep(.modal-dialog button) {
    height: 44px;
    line-height: 44px;
  }

  &.drawer-mode .modal-body {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}

// bottom sheet 形态
.modal-content.modal--bottom-sheet {
  width: 100%;
  max-width: 100%;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
