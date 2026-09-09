import type { Component, CSSProperties } from 'vue'
import type { useModal } from './hooks/use-modal'

export interface SizeOptions {
  small: string | number
  middle: string | number
  large: string | number
}

export interface ShowLoadingOptions {
  duration?: number
  text?: string
}

export interface OpenModalOptions {
  closeable?: boolean
  esc?: boolean
  maskClosable?: boolean
  title?: string
  header?: boolean
  footer?: boolean
  width?: number | string
  height?: number | string
  size?: 'large' | 'middle' | 'small'
  fullscreen?: boolean
  draggable?: boolean
  form?: string
  mode?: 'dialog' | 'drawer'
  /** 移动端形态开关：'auto' 跟随视口宽度（默认，继承 Provider），boolean 强制指定 */
  mobile?: boolean | 'auto'
  position?: 'top' | 'right' | 'bottom' | 'left'
  backgroundColor?: string
  bodyStyle?: CSSProperties
  submitText?: string
  cancelText?: string
  /** 弹窗层级，默认 1000；arco 弹层（下拉、弹窗等）从 1001 起自增，通常无需调整 */
  zIndex?: number
  onOk?: (options: { close: () => void }) => void
  onCancel?: () => void
}

export interface ModalElement extends OpenModalOptions {
  id: string
  resolve: (data?: any) => void
  reject: (key: 'CANCEL') => void
  component: Component
  props: Record<string, any>
  options: OpenModalOptions & { type?: string }
  listeners: {
    event: string
    callback: (actions: ReturnType<typeof useModal>) => void
  }[]
}

export interface ModalActions {
  open: (
    component: Component | 'confirm' | 'info' | 'warning' | 'error' | 'success',
    props?: Record<string, any>,
    options?: OpenModalOptions,
  ) => Promise<any> & { close: () => void }
  close: (id: string, data?: any) => void
  closeAll: () => void
  addEventListener: (id: string, event: 'submit', callback: (modal: ReturnType<typeof useModal>) => void) => void
  showLoading: (id?: string, options?: ShowLoadingOptions) => () => void
  hideLoading: (id?: string) => void
}
