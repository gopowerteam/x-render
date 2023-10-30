import type { Component, Ref } from 'vue'

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
  size?: 'large' | 'middle' | 'small' | 'fullscreen'
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
  onSubmit: Ref<() => void>
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
  addSubmitListener: (id: string, fun: () => void) => void
}
