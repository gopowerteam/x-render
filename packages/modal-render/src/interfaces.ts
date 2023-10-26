import type { Component } from 'vue'

export interface SizeOptions {
  small: number
  middle: number
  large: number
}

export interface OpenModalOptions {
  closable?: boolean
  mask?: boolean
  maskClosable?: boolean
  title?: string
  header?: boolean
  footer?: boolean
  width?: number | string
  size?: 'large' | 'middle' | 'small'
}

export interface ModalElement extends OpenModalOptions {
  id: string
  resolve: (data?: any) => void
  component: Component
  props: Record<string, any>
  options: OpenModalOptions
}

export interface ModalActions {
  open: (
    component: Component,
    props: Record<string, any>,
    options: OpenModalOptions,
  ) => Promise<any | void>
  close: (id: string, data?: any) => void
  closeAll: () => void
}
