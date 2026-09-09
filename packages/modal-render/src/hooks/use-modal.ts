import type { Component } from 'vue'
import type { OpenModalOptions, ShowLoadingOptions } from '../interfaces'
import { getCurrentInstance, inject } from 'vue'
import { ModalKey } from '../constants'
import { findContainer } from '../utils/find-container'

export function useModal() {
  const modal = inject(ModalKey)
  const ctx = getCurrentInstance()

  /** 统一守卫：未在 ModalProvider 内使用时抛出中文错误 */
  function requireModal() {
    if (!modal) {
      throw new Error('未找到 ModalProvider 组件，请将组件包裹在 <ModalProvider> 内使用')
    }

    return modal
  }

  /** 定位当前所在弹窗容器的 id */
  function currentContainerId() {
    const modalContainer = findContainer(ctx, 'ModalContainer')
    const id = modalContainer?.props?.id as string | undefined

    if (!id) {
      throw new Error('未找到当前弹窗容器，请在弹窗内容组件中使用')
    }

    return id
  }

  function open(
    component: 'confirm',
    props: {
      title?: string
      content: string
      onOk?: () => Promise<void> | void
      onCancel?: () => Promise<void> | void
      footer?: () => JSX.Element
    },
  ): Promise<any> & { close: () => void }
  function open(
    component: 'info' | 'warning' | 'error' | 'success',
    props: {
      title?: string
      content: string
    },
  ): Promise<any> & { close: () => void }
  function open(
    component: Component,
    props?: Record<string, any>,
    options?: OpenModalOptions,
  ): Promise<any> & { close: () => void }
  function open(
    component: Component | 'confirm' | 'info' | 'warning' | 'error' | 'success',
    props?: Record<string, any>,
    options?: OpenModalOptions,
  ): Promise<any> & { close: () => void } {
    return requireModal().open(component, props, options)
  }

  return {
    open,
    close(data?: any): void {
      const actions = requireModal()
      actions.close(currentContainerId(), data)
    },
    closeAll() {
      requireModal().closeAll()
    },
    showLoading(options?: ShowLoadingOptions) {
      const actions = requireModal()
      const container = findContainer(ctx, 'ModalContainer')
      const id = container?.props?.id as string | undefined

      return actions.showLoading(id, options)
    },
    hideLoading() {
      const actions = requireModal()
      const container = findContainer(ctx, 'ModalContainer')
      const id = container?.props?.id as string | undefined

      return actions.hideLoading(id)
    },
    // 快捷方法直接调用 open 函数（不依赖 this），支持 const { confirm } = useModal() 解构调用
    confirm(props: {
      title?: string
      content: string
      onOk?: () => Promise<void> | void
      onCancel?: () => Promise<void> | void
      footer?: () => JSX.Element
    }) {
      return open('confirm', props)
    },
    info(props: {
      title?: string
      content: string
    }) {
      return open('info', props)
    },
    error(props: {
      title?: string
      content: string
    }) {
      return open('error', props)
    },
    warning(props: {
      title?: string
      content: string
    }) {
      return open('warning', props)
    },
    success(props: {
      title?: string
      content: string
    }) {
      return open('success', props)
    },
  }
}
