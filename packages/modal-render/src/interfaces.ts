import type { Component, Ref } from 'vue'
import type { useModal } from './hooks/use-modal'

export interface SizeOptions {
  small: number
  middle: number
  large: number
}

export interface OpenModalOptions {
  closeable?: boolean
  esc?: boolean
  mask?: boolean
  maskClosable?: boolean
  title?: string
  header?: boolean
  footer?: boolean
  width?: number | string
  size?: 'large' | 'middle' | 'small'
  fullscreen?: boolean
  draggable?: boolean
  form?: string
  mode?: 'dialog' | 'drawer'
}

export interface ModalElement extends OpenModalOptions {
  id: string
  resolve: (data?: any) => void
  component: Component
  props: Record<string, any>
  options: OpenModalOptions
  onSubmit: Ref<((actions: ReturnType<typeof useModal>) => void) | null>
}

export interface ModalActions {
  open: (
    component: Component,
    props: Record<string, any>,
    options: OpenModalOptions,
  ) => Promise<any | void>
  close: (id: string, data?: any) => void
  closeAll: () => void
  getElement: (id: string) => ModalElement | undefined
  addSubmitListener: (id: string, fun: (modal: ReturnType<typeof useModal>) => void) => void
}
