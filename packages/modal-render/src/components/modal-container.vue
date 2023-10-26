<template>
  <div class="modal-container">
    <div
      ref="wrapperRef"
      class="modal-wrapper"
      :style="wrapperStyle"
      @click.self="maskClosable && onClose()"
    >
      <div ref="contentRef" class="modal-content" :style="contentStyle">
        <div v-if="header" ref="" class="modal-header">
          <div class="title font-bold">
            {{ title }}
          </div>
          <div class="action">
            <div class="i-icon-park-outline:close block cursor-pointer" @click="onClose" />
          </div>
        </div>
        <div class="modal-body">
          <Component :is="component" v-bind="componentProps" />
        </div>
        <div v-if="footer" class="modal-footer" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.modal-wrapper {
  z-index: 10000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  overflow: auto;
}

.modal-content {
    margin: auto;
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
    border-bottom: solid 1px var(--color-border-1, #E8E8E8);
}

.modal-body{
  padding: 20px 10px;
  box-sizing: border-box;
}
</style>

<script setup lang="ts">
import type { Component, StyleValue } from 'vue'
import {
  computed,
  defineProps,
  inject,
  shallowRef,
} from 'vue'
import { ModalKey } from '../constants'
import type { SizeOptions } from '../interfaces'

const props = withDefaults (defineProps<{
  id: string
  component: Component
  componentProps: Record<string, any>
  width?: number | string
  maxWidth?: number | string
  sizes: SizeOptions
  size: 'small' | 'middle' | 'large'
  title?: string
  header?: boolean
  footer?: boolean
  closeable?: boolean
  keyboard?: boolean
  maskClosable?: boolean
}>()
, {
  header: true,
  closeable: true,
  footer: false,
  keyboard: false,
  maskClosable: false,
  size: 'middle',
})

const modal = inject(ModalKey)

const wrapperRef = shallowRef<any>()
const contentRef = shallowRef<any>()

const wrapperStyle = computed(() => {
  const wrapper = wrapperRef.value
  const content = contentRef.value

  const oversize = wrapper && content && wrapper.clientHeight <= content.clientHeight

  return oversize
    ? { padding: '10px 0' }
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
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
  const styles: StyleValue = {}

  if (props.size) {
    styles.width = formatSizeValue(props.sizes[props.size])
  }

  if (props.width) {
    styles.width = formatSizeValue(props.width)
  }

  if (props.maxWidth) {
    styles.maxWidth = formatSizeValue(props.maxWidth)
  }

  return styles
})

// function onResize() {
//   if (window) {
//     window.addEventListener('resize', () => {
//       triggerRef(wrapperRef)
//       triggerRef(contentRef)
//     })
//   }
// }

// function onKeyboard() {
//   if (props.closable && props.keyboard) {
//     const handleEsc = ({ key }) => {
//       if (key === 'Escape') {
//         modal.close(props.id)
//         window.removeEventListener('keydown', handleEsc)
//       }
//     }

//     window.addEventListener('keydown', handleEsc)
//   }
// }
</script>
